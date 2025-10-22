import './style.css'
import { BlockBuilder } from 'block-builder'

// Простая конфигурация блоков
const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    description: 'Простой текстовый блок',
    render: {
      kind: 'html',
      template: (props) => `
        <div class="text-block" style="padding: 1rem; background: white; border-radius: 4px; margin-bottom: 1rem;">
          <p style="font-size: ${props.fontSize || 16}px; color: ${props.color || '#333'};">
            ${props.content || 'Пустой текст'}
          </p>
        </div>
      `
    },
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        defaultValue: 'Новый текстовый блок'
      },
      {
        field: 'fontSize',
        label: 'Размер шрифта',
        type: 'number',
        defaultValue: 16
      },
      {
        field: 'color',
        label: 'Цвет',
        type: 'color',
        defaultValue: '#333333'
      }
    ]
  },
  image: {
    title: 'Блок изображения',
    description: 'Простой блок с изображением',
    render: {
      kind: 'html',
      template: (props) => `
        <div class="image-block" style="padding: 1rem; background: white; border-radius: 4px; margin-bottom: 1rem; text-align: center;">
          <img src="${props.src || '/1.jpeg'}" 
               alt="${props.alt || 'Изображение'}" 
               style="max-width: 100%; border-radius: 4px;" />
        </div>
      `
    },
    fields: [
      {
        field: 'src',
        label: 'URL изображения',
        type: 'text',
        defaultValue: '/1.jpeg'
      },
      {
        field: 'alt',
        label: 'Описание',
        type: 'text',
        defaultValue: 'Изображение'
      }
    ]
  }
}

// Инициализация BlockBuilder БЕЗ готового UI
// Мы будем использовать только программный API
const blockBuilder = new BlockBuilder({
  containerId: 'hidden-container', // Скрытый контейнер
  blockConfigs: blockConfigs,
  // Отключаем автоматический UI (если такая опция есть)
  renderUI: false
})

console.log('✅ BlockBuilder API инициализирован')
console.log('📦 Используется только программный API, без готового UI')

// Элементы DOM
const addTextBtn = document.getElementById('addTextBlock')
const addImageBtn = document.getElementById('addImageBlock')
const getAllBlocksBtn = document.getElementById('getAllBlocks')
const clearBlocksBtn = document.getElementById('clearBlocks')
const blocksJsonEl = document.getElementById('blocksJson')
const blocksContainerEl = document.getElementById('blocksContainer')

// Счетчик для уникальных ID
let blockCounter = 0

// Функция обновления отображения
function updateDisplay() {
  // Получаем все блоки через API
  const blocks = blockBuilder.getAllBlocks()
  
  // Обновляем JSON представление
  blocksJsonEl.textContent = JSON.stringify(blocks, null, 2)
  
  // Обновляем визуальный рендер
  blocksContainerEl.innerHTML = blocks.length === 0 
    ? '<p style="color: #999; text-align: center; padding: 2rem;">Блоков пока нет</p>'
    : ''
  
  blocks.forEach(block => {
    const blockEl = document.createElement('div')
    blockEl.className = 'block-item'
    blockEl.innerHTML = `
      <div class="block-actions">
        <button class="btn btn-secondary btn-sm" onclick="editBlock('${block.id}')">Изменить</button>
        <button class="btn btn-danger btn-sm" onclick="deleteBlock('${block.id}')">Удалить</button>
      </div>
      <strong>${block.type}</strong> (ID: ${block.id})<br>
      <small>Data: ${JSON.stringify(block.data).substring(0, 100)}...</small>
    `
    blocksContainerEl.appendChild(blockEl)
  })
}

// Добавление текстового блока через API
addTextBtn.addEventListener('click', () => {
  blockCounter++
  
  const newBlock = blockBuilder.createBlock({
    type: 'text',
    data: {
      content: `Текстовый блок #${blockCounter}`,
      fontSize: 16 + Math.floor(Math.random() * 16),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }
  })
  
  console.log('✅ Создан блок:', newBlock)
  updateDisplay()
})

// Добавление блока изображения через API
addImageBtn.addEventListener('click', () => {
  blockCounter++
  
  const newBlock = blockBuilder.createBlock({
    type: 'image',
    data: {
      src: `/${['1.jpeg', '2.jpg', '3.png', 'qw.jpg', 'bear.jpg'][(blockCounter - 1) % 5]}`,
      alt: `Изображение ${blockCounter}`
    }
  })
  
  console.log('✅ Создан блок:', newBlock)
  updateDisplay()
})

// Получение всех блоков
getAllBlocksBtn.addEventListener('click', () => {
  const blocks = blockBuilder.getAllBlocks()
  console.log('📦 Все блоки:', blocks)
  alert(`Всего блоков: ${blocks.length}\n\nСмотрите консоль для деталей`)
})

// Очистка всех блоков
clearBlocksBtn.addEventListener('click', () => {
  if (confirm('Удалить все блоки?')) {
    const blocks = blockBuilder.getAllBlocks()
    blocks.forEach(block => {
      blockBuilder.deleteBlock(block.id)
    })
    console.log('🗑️ Все блоки удалены')
    updateDisplay()
  }
})

// Глобальные функции для кнопок в DOM
window.editBlock = (id) => {
  const block = blockBuilder.getBlock(id)
  if (!block) {
    alert('Блок не найден')
    return
  }
  
  const newContent = prompt('Новое содержимое:', JSON.stringify(block.data, null, 2))
  if (newContent) {
    try {
      const newData = JSON.parse(newContent)
      blockBuilder.updateBlock(id, newData)
      console.log('✏️ Блок обновлен:', id)
      updateDisplay()
    } catch (e) {
      alert('Ошибка парсинга JSON: ' + e.message)
    }
  }
}

window.deleteBlock = (id) => {
  if (confirm(`Удалить блок ${id}?`)) {
    blockBuilder.deleteBlock(id)
    console.log('🗑️ Блок удален:', id)
    updateDisplay()
  }
}

// Начальное отображение
updateDisplay()

// Добавим пару примеров для демонстрации
setTimeout(() => {
  addTextBtn.click()
  setTimeout(() => {
    addImageBtn.click()
  }, 100)
}, 500)

