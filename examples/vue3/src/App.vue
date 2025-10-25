<template>
  <div class="app">
    <div class="app-header">
      <h1>BlockBuilder Vue3 + Vite Example</h1>
      <div class="app-description">
        <p>✅ Полноценное Vue3 приложение с Vite</p>
        <p>✅ Настоящие Vue компоненты с SFC</p>
        <p>✅ Swiper Vue компонент из npm пакета</p>
        <p>✅ Все возможности современного фреймворка</p>
      </div>
    </div>

    <div class="app-content">
      <BlockBuilderComponent 
        :config="{ availableBlockTypes }"
        :component-registry="registry"
        :api-select-use-case="apiSelectUseCase"
        :custom-field-renderer-registry="customFieldRendererRegistry"
        :on-save="handleSave"
        :initial-blocks="initialBlocks"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  BlockBuilderComponent,
  MemoryComponentRegistry,
  ApiSelectUseCase,
  FetchHttpClient,
  CustomFieldRendererRegistry
} from 'block-builder/vue'
import { blockConfigs } from './block-config'
import { WysiwygFieldRenderer } from './customFieldRenderers/WysiwygFieldRenderer'

// Создаем HTTP клиент и ApiSelectUseCase (Dependency Injection)
const httpClient = new FetchHttpClient()
const apiSelectUseCase = new ApiSelectUseCase(httpClient)

// ✅ Создаем реестр кастомных полей и регистрируем WYSIWYG редактор
const customFieldRendererRegistry = new CustomFieldRendererRegistry()
customFieldRendererRegistry.register(new WysiwygFieldRenderer())

// Создаем registry и регистрируем компоненты
const registry = new MemoryComponentRegistry()
Object.entries(blockConfigs).forEach(([type, config]) => {
  if (config.render?.component) {
    registry.register(type, config.render.component)
  }
})

// Формируем конфигурацию для BlockBuilder
const availableBlockTypes = ref(
  Object.entries(blockConfigs).map(([type, cfg]) => ({
    type,
    label: cfg.title,
    icon: cfg.icon, // Добавляем иконку
    render: cfg.render,
    fields: cfg.fields, // Передаем поля для форм
    spacingOptions: cfg.spacingOptions, // ✅ Передаем spacingOptions для кастомных брекпоинтов
    defaultSettings: {},
    defaultProps: cfg.fields?.reduce((acc, field) => {
      acc[field.field] = field.defaultValue
      return acc
    }, {}) || {}
  }))
)

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

// Начальные блоки для загрузки при инициализации
const initialBlocks = ref(loadSavedBlocks())

// Функция сохранения блоков
const handleSave = async (blocks) => {
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

console.log('✅ Vue3 Example инициализирован')
console.log('📦 Доступные блоки:', Object.keys(blockConfigs))
console.log('📋 Registry:', registry)
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.app-header {
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.app-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.app-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.app-description p {
  margin: 0.25rem 0;
}

.app-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.block-builder-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

