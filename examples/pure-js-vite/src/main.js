import './style.css'
import '../../../src/ui/styles/index.scss' // Импорт стилей BlockBuilder
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'
import { WysiwygFieldRenderer } from './customFieldRenderers/WysiwygFieldRenderer.js'

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

// Инициализация BlockBuilder
const blockBuilder = new BlockBuilder({
  containerId: 'block-builder-container',
  blockConfigs: blockConfigs,
  theme: 'light',
  locale: 'ru',
  // Загружаем сохранённые блоки при инициализации
  initialBlocks: loadSavedBlocks(),
  // Пример функции сохранения
  onSave: async (blocks) => {
    console.log('💾 Сохранение блоков:', blocks)

    try {
      // Здесь вы можете сохранять блоки любым способом:
      // 1. Отправить на сервер через API
      // await fetch('/api/blocks', { method: 'POST', body: JSON.stringify(blocks) })

      // 2. Сохранить в localStorage
      localStorage.setItem('saved-blocks', JSON.stringify(blocks))

      // 3. Сохранить в IndexedDB
      // await saveToIndexedDB(blocks)

      // Возвращаем true при успешном сохранении
      return true
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      // Возвращаем false при ошибке
      return false
    }
  }
})

// ✅ Регистрируем кастомный WYSIWYG редактор
blockBuilder.registerCustomFieldRenderer(new WysiwygFieldRenderer())

console.log('✅ BlockBuilder инициализирован')
console.log('✅ Зарегистрирован WYSIWYG редактор')
console.log('📦 Доступные блоки:', Object.keys(blockConfigs))
console.log('🎯 Это чистый JS пример с Vite сборкой')

