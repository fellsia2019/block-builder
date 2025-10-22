import './style.css'
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'

// Инициализация BlockBuilder
const blockBuilder = new BlockBuilder({
  containerId: 'block-builder-container',
  blockConfigs: blockConfigs,
  theme: 'light',
  locale: 'ru'
})

console.log('✅ BlockBuilder инициализирован')
console.log('📦 Доступные блоки:', Object.keys(blockConfigs))
console.log('🎯 Это чистый JS пример с Vite сборкой')

