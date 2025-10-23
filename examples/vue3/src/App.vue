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
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BlockBuilderComponent, MemoryComponentRegistry } from 'block-builder/vue'
import { blockConfigs } from './block-config'

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
    defaultSettings: {},
    defaultProps: cfg.fields?.reduce((acc, field) => {
      acc[field.field] = field.defaultValue
      return acc
    }, {}) || {}
  }))
)

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

