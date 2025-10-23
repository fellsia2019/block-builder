import './style.css'
import { BlockBuilder } from 'block-builder'

// Простая конфигурация блоков
const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    icon: '📝',
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
    icon: '🖼️',
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

// Загрузка сохранённых блоков из localStorage
const loadSavedBlocks = () => {
  try {
    const savedData = localStorage.getItem('saved-blocks')
    if (savedData) {
      const blocks = JSON.parse(savedData)
      console.log(`📦 Найдено ${blocks.length} сохранённых блоков`)
      return blocks
    }
  } catch (error) {
    console.error('Ошибка загрузки сохранённых блоков:', error)
  }
  return []
}

// Инициализация BlockBuilder БЕЗ готового UI
// Мы будем использовать только программный API
const blockBuilder = new BlockBuilder({
  containerId: 'hidden-container', // Скрытый контейнер
  blockConfigs: blockConfigs,
  autoRender: false, // Отключаем автоматический UI
  initialBlocks: loadSavedBlocks() // Загружаем сохранённые блоки
})

console.log('✅ BlockBuilder API инициализирован')
console.log('📦 Используется только программный API, без готового UI')

// Элементы DOM
const addTextBtn = document.getElementById('addTextBlock')
const addImageBtn = document.getElementById('addImageBlock')
const saveBlocksBtn = document.getElementById('saveBlocks')
const getAllBlocksBtn = document.getElementById('getAllBlocks')
const clearBlocksBtn = document.getElementById('clearBlocks')
const blocksJsonEl = document.getElementById('blocksJson')
const blocksContainerEl = document.getElementById('blocksContainer')

// Счетчик для уникальных ID
let blockCounter = 0

// Функция обновления отображения
async function updateDisplay() {
  // Получаем все блоки через API
  const blocks = await blockBuilder.getAllBlocks()
  
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
      <small>Props: ${JSON.stringify(block.props).substring(0, 100)}...</small>
    `
    blocksContainerEl.appendChild(blockEl)
  })
}

// Добавление текстового блока через API
addTextBtn.addEventListener('click', async () => {
  blockCounter++
  
  const newBlock = await blockBuilder.createBlock({
    type: 'text',
    settings: {},
    props: {
      content: `Текстовый блок #${blockCounter}`,
      fontSize: 16 + Math.floor(Math.random() * 16),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }
  })
  
  console.log('✅ Создан блок:', newBlock)
  await updateDisplay()
})

// Добавление блока изображения через API
addImageBtn.addEventListener('click', async () => {
  blockCounter++
  
  const newBlock = await blockBuilder.createBlock({
    type: 'image',
    settings: {},
    props: {
      src: `/${['1.jpeg', '2.jpg', '3.png', 'qw.jpg', 'bear.jpg'][(blockCounter - 1) % 5]}`,
      alt: `Изображение ${blockCounter}`
    }
  })
  
  console.log('✅ Создан блок:', newBlock)
  await updateDisplay()
})

// Сохранение блоков (пример пользовательской реализации)
saveBlocksBtn.addEventListener('click', async () => {
  try {
    const blocks = await blockBuilder.getAllBlocks()
    
    // Пример 1: Сохранение в localStorage
    localStorage.setItem('saved-blocks', JSON.stringify(blocks))
    
    // Пример 2: Отправка на сервер (раскомментируйте при наличии API)
    // await fetch('/api/blocks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(blocks)
    // })
    
    console.log('✅ Блоки успешно сохранены:', blocks)
    alert(`✅ Успешно сохранено блоков: ${blocks.length}`)
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error)
    alert('❌ Ошибка при сохранении блоков')
  }
})

// Получение всех блоков
getAllBlocksBtn.addEventListener('click', async () => {
  const blocks = await blockBuilder.getAllBlocks()
  console.log('📦 Все блоки:', blocks)
  alert(`Всего блоков: ${blocks.length}\n\nСмотрите консоль для деталей`)
})

// Очистка всех блоков
clearBlocksBtn.addEventListener('click', async () => {
  if (confirm('Удалить все блоки?')) {
    const blocks = await blockBuilder.getAllBlocks()
    for (const block of blocks) {
      await blockBuilder.deleteBlock(block.id)
    }
    console.log('🗑️ Все блоки удалены')
    await updateDisplay()
  }
})

// Глобальные функции для кнопок в DOM
window.editBlock = async (id) => {
  const block = await blockBuilder.getBlock(id)
  if (!block) {
    alert('Блок не найден')
    return
  }
  
  const newContent = prompt('Новое содержимое:', JSON.stringify(block.props, null, 2))
  if (newContent) {
    try {
      const newProps = JSON.parse(newContent)
      await blockBuilder.updateBlock(id, { props: newProps })
      console.log('✏️ Блок обновлен:', id)
      await updateDisplay()
    } catch (e) {
      alert('Ошибка парсинга JSON: ' + e.message)
    }
  }
}

window.deleteBlock = async (id) => {
  if (confirm(`Удалить блок ${id}?`)) {
    await blockBuilder.deleteBlock(id)
    console.log('🗑️ Блок удален:', id)
    await updateDisplay()
  }
}

// Начальное отображение
updateDisplay()

// Если блоков нет, добавим пару примеров для демонстрации
setTimeout(async () => {
  const blocks = await blockBuilder.getAllBlocks()
  if (blocks.length === 0) {
    addTextBtn.click()
    setTimeout(() => {
      addImageBtn.click()
    }, 100)
  }
}, 500)

