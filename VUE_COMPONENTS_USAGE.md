# Использование Vue3 компонентов BlockBuilder

## ✅ Готовые компоненты из коробки

BlockBuilder предоставляет готовые Vue3 компоненты для использования в ваших проектах.

## 📦 Установка

```bash
npm install block-builder
```

## 🚀 Базовое использование

### 1. Импорт компонента

```vue
<template>
  <div>
    <BlockBuilderComponent :config="config" />
  </div>
</template>

<script setup>
import { BlockBuilderComponent } from 'block-builder/vue'

const config = {
  availableBlockTypes: [
    {
      type: 'text',
      label: 'Текстовый блок',
      render: {
        kind: 'component',
        framework: 'vue',
        component: YourTextComponent
      },
      defaultSettings: {},
      defaultProps: {
        content: 'Текст по умолчанию'
      }
    }
  ]
}
</script>
```

### 2. С вашими Vue SFC компонентами

```vue
<!-- TextBlock.vue -->
<template>
  <div class="text-block">
    {{ content }}
  </div>
</template>

<script setup>
defineProps({
  content: String
})
</script>
```

```vue
<!-- App.vue -->
<script setup>
import { BlockBuilderComponent } from 'block-builder/vue'
import TextBlock from './components/TextBlock.vue'

const config = {
  availableBlockTypes: [
    {
      type: 'text',
      label: 'Текст',
      render: {
        kind: 'component',
        framework: 'vue',
        component: TextBlock
      },
      defaultProps: {
        content: 'Hello World'
      }
    }
  ]
}
</script>

<template>
  <BlockBuilderComponent :config="config" />
</template>
```

## 📝 Конфигурация блоков

### Структура конфигурации

```typescript
interface IBlockType {
  type: string                    // Уникальный идентификатор
  label: string                   // Название в UI
  render: {
    kind: 'component'
    framework: 'vue'
    component: Component           // Vue SFC компонент
  }
  defaultSettings?: object         // Настройки блока
  defaultProps?: object           // Props компонента
}
```

### Пример с полями и валидацией

```javascript
const blockConfigs = {
  hero: {
    title: 'Hero секция',
    description: 'Главная секция страницы',
    render: {
      kind: 'component',
      framework: 'vue',
      component: HeroBlock
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок',
        type: 'text',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Добро пожаловать'
      },
      {
        field: 'subtitle',
        label: 'Подзаголовок',
        type: 'textarea',
        defaultValue: 'Описание'
      }
    ]
  }
}

// Преобразование в формат для BlockBuilderComponent
const config = {
  availableBlockTypes: Object.entries(blockConfigs).map(([type, cfg]) => ({
    type,
    label: cfg.title,
    render: cfg.render,
    defaultSettings: {},
    defaultProps: cfg.fields?.reduce((acc, field) => {
      acc[field.field] = field.defaultValue
      return acc
    }, {}) || {}
  }))
}
```

## 🎨 Примеры компонентов

### Простой текстовый блок

```vue
<template>
  <div class="text-block" :style="{ fontSize: fontSize + 'px', color }">
    {{ content }}
  </div>
</template>

<script setup>
defineProps({
  content: { type: String, required: true },
  fontSize: { type: Number, default: 16 },
  color: { type: String, default: '#333' }
})
</script>
```

### Блок с Swiper

```vue
<template>
  <Swiper
    :modules="modules"
    :navigation="true"
    :pagination="{ clickable: true }"
  >
    <SwiperSlide v-for="slide in slides" :key="slide.id">
      <img :src="slide.image" :alt="slide.title" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'

defineProps({
  slides: Array
})

const modules = [Navigation, Pagination]
</script>
```

## 🔧 API

### Доступные компоненты

```typescript
import {
  BlockBuilderComponent,    // Главный компонент
  BlockComponent,           // Компонент отдельного блока
  BlockProperties,          // Панель свойств
  CardDetailModal          // Модальное окно
} from 'block-builder/vue'
```

### Доступные use-cases

```typescript
import {
  BlockManagementUseCase,
  ComponentManagementUseCase
} from 'block-builder/vue'
```

### Доступные репозитории

```typescript
import {
  MemoryBlockRepositoryImpl,
  LocalStorageBlockRepositoryImpl,
  MemoryComponentRegistry
} from 'block-builder/vue'
```

## 🎯 Программное управление

Если нужен полный контроль, используйте use-cases напрямую:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import {
  BlockManagementUseCase,
  MemoryBlockRepositoryImpl,
  MemoryComponentRegistry
} from 'block-builder/vue'

const repository = new MemoryBlockRepositoryImpl()
const registry = new MemoryComponentRegistry()
const blockManagement = new BlockManagementUseCase(repository, registry)

const blocks = ref([])

const addBlock = async () => {
  const block = await blockManagement.createBlock({
    type: 'text',
    data: { content: 'New block' }
  })
  blocks.value.push(block)
}

onMounted(async () => {
  blocks.value = await blockManagement.getAllBlocks()
})
</script>
```

## 📚 Полный пример

См. [examples/vue3/](./examples/vue3/) для полноценного примера с:
- ✅ Настоящими Vue SFC компонентами
- ✅ Swiper Vue компонентом из npm
- ✅ Полной конфигурацией блоков
- ✅ Всеми возможностями фреймворка

## 🔗 Ссылки

- [Главная документация](./README.md)
- [Примеры](./examples/README.md)
- [Vue3 пример](./examples/vue3/README.md)

---

**Теперь BlockBuilder из коробки предоставляет готовые Vue3 компоненты!** 🎉

