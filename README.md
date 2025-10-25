# 🏗️ BlockBuilder - Блочный конструктор с чистой архитектурой

Библиотека для создания блочных конструкторов с правильной чистой архитектурой.

## 🎯 Принципы чистой архитектуры

### Структура проекта
```
src/
├── core/                    # 🎯 Ядро приложения
│   ├── entities/            # ✅ Сущности с бизнес-правилами
│   ├── use-cases/           # ✅ Сценарии (единственный вход в ядро)
│   ├── ports/               # ✅ Интерфейсы (контракты)
│   └── dto/                 # ✅ Объекты передачи данных
├── infrastructure/          # 🔧 Реализации портов
│   └── repositories/        # ✅ Реализации репозиториев
├── ui/                      # 🎨 Только вызывает Use Cases
│   └── components/          # ✅ Vue3 компоненты
└── examples/                # 📚 Примеры использования
```

### Зависимости
- **UI → Use Case** ✅
- **Use Case → Entity** ✅
- **Use Case → Port** ✅
- **Infrastructure → Port** ✅

## 🚀 Быстрый старт

### Установка
```bash
npm install block-builder
```

### Для Vue3 проектов

BlockBuilder предоставляет готовые Vue3 компоненты из коробки:

```vue
<template>
  <BlockBuilderComponent :config="config" />
</template>

<script setup>
import { BlockBuilderComponent } from 'block-builder/vue'
import YourTextBlock from './components/YourTextBlock.vue'

const config = {
  availableBlockTypes: [
    {
      type: 'text',
      label: 'Текст',
      render: {
        kind: 'component',
        framework: 'vue',
        component: YourTextBlock  // Ваш Vue SFC компонент!
      },
      defaultProps: { content: 'Hello' }
    }
  ]
}
</script>
```

📚 **[Полная документация Vue3 компонентов →](./VUE_COMPONENTS_USAGE.md)**

### Использование

#### Основной API (Для Pure JS/Other frameworks)
```javascript
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'

// Создание экземпляра с автоматическим UI
const blockBuilder = new BlockBuilder({
  containerId: 'my-app', // ID контейнера для рендеринга UI
  blockConfigs: blockConfigs,
  storage: 'localStorage', // или 'memory'
  autoRender: true // По умолчанию true - автоматически рендерит UI
})

// UI рендерится автоматически!
// Пользователь получает готовые кнопки, формы, валидацию
```

#### Только API (без UI)
```javascript
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'

// Создание экземпляра только с API
const blockBuilder = new BlockBuilder({
  containerId: 'my-app',
  blockConfigs: blockConfigs,
  autoRender: false // Отключаем автоматический UI
})

// Использование только API
await blockBuilder.createBlock({
  type: 'text',
  settings: { fontSize: 16 },
  props: { content: 'Hello World', color: '#333' }
})

const blocks = await blockBuilder.getAllBlocks()
console.log('Все блоки:', blocks)
```

#### Vue3 приложение
```javascript
// 1. Создайте конфигурацию блоков
// block-config.js
import TextBlock from './components/TextBlock.js'
import ButtonBlock from './components/ButtonBlock.js'

export const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    component: TextBlock,
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        rules: [{ type: 'required', message: 'Текст обязателен' }]
      }
    ]
  }
}
```

```html
<!-- 2. Используйте API в своем приложении -->
<script type="module">
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'

// Создайте свой собственный UI, используя API
const blockBuilder = new BlockBuilder({
  containerId: 'my-app',
  blockConfigs: blockConfigs
})

// Ваш собственный UI код здесь
</script>
```

#### Pure JavaScript
```javascript
// block-config.js
export const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        rules: [{ type: 'required', message: 'Текст обязателен' }]
      }
    ]
  }
}
```

## 🏗️ Архитектура

### Core (Ядро)
- **Entities** - бизнес-правила
- **Use Cases** - сценарии приложения
- **Ports** - интерфейсы для внешнего мира
- **DTO** - объекты передачи данных

### Infrastructure
- **Repositories** - реализации портов
- **MemoryBlockRepositoryImpl** - хранение в памяти
- **LocalStorageBlockRepositoryImpl** - хранение в localStorage

### UI
- **Vue3 компоненты** - только вызывают Use Cases
- **BlockBuilder** - основной конструктор
- **BlockComponent** - компонент блока
- **BlockProperties** - панель свойств

## 📋 API

### BlockBuilder (Основной класс)
```javascript
// Инициализация пакета
const blockBuilder = new BlockBuilder({
  containerId: 'block-builder-container',  // ID контейнера для рендеринга
  blockConfigs: blockConfigs,        // Конфигурация блоков
  theme: 'light',                    // Тема (light/dark)
  locale: 'ru'                      // Локализация
})

// Пакет автоматически рендерит:
// - Контролы для добавления блоков
// - Формы создания/редактирования блоков
// - Валидацию полей
// - Модальные окна
// - UI компоненты
```

### Конфигурация блоков
```javascript
const blockConfig = {
  title: 'Название блока',
  description: 'Описание блока',
  component: MyVueComponent,        // Vue компонент (для Vue3)
  template: '<div>{{ content }}</div>', // HTML шаблон (для Pure JS)
  fields: [
    {
      field: 'fieldName',
      label: 'Название поля',
      type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'checkbox' | 'url',
      placeholder: 'Подсказка',
      rules: [
        {
          type: 'required' | 'email' | 'url' | 'min' | 'max' | 'minLength' | 'maxLength',
          value?: number,
          message: 'Сообщение об ошибке'
        }
      ],
      defaultValue: 'Значение по умолчанию',
      options?: [
        { value: 'value', label: 'Label' }
      ]
    }
  ]
}
```

## 🧪 Тестирование

### 🚀 Команды тестирования

```bash
# Запуск всех тестов
npm test

# Тесты с отчетом покрытия кода
npm run test:coverage

# Тесты в watch режиме (автоматический перезапуск)
npm run test:watch

# Только unit тесты
npm run test:unit

# Только интеграционные тесты
npm run test:integration

# Для CI/CD
npm run test:ci

# С подробным выводом
npm run test:verbose

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

### 📁 Структура тестов

```
src/
├── __tests__/                      # Интеграционные тесты
│   └── BlockBuilderFacade.integration.test.ts
├── core/
│   ├── entities/__tests__/         # Тесты доменных сущностей
│   └── use-cases/__tests__/        # Тесты use cases
├── infrastructure/
│   ├── repositories/__tests__/     # Тесты репозиториев
│   ├── registries/__tests__/       # Тесты реестров
│   └── http/__tests__/             # Тесты HTTP клиента
└── utils/__tests__/                # Тесты утилит
```

### 🎯 Покрытие тестами

| Слой | Coverage | Статус |
|------|----------|--------|
| Core Entities | 100% | ✅ |
| Core Use Cases | 93-100% | ✅ |
| Infrastructure | 93-100% | ✅ |
| Utils (основные) | 71-100% | ✅ |
| **UI Services** | **38.69%** | ✅ |
| - StyleManager | 100% | ✅ |
| - ModalManager | 100% | ✅ |
| - FormBuilder | ~95% | ✅ |
| - UIRenderer | ~80% | ✅ |
| - SpacingControlRenderer | ~85% | ✅ |
| - RepeaterControlRenderer | ~85% | ✅ |
| - ApiSelectControlRenderer | ~85% | ✅ |
| **UI Controllers** | **11%** | ✅ |
| - BlockUIController | 11% | ✅ |

**Результат**: При любом изменении кода автоматически запускаются тесты и выявляются ошибки программно, а не ручной проверкой!

## 🛠️ Разработка

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Разработка с watch
npm run dev

# Запуск сервера разработки
npm run start
```

## 📚 Примеры

Смотрите папку `examples/` для полноценных примеров использования:

### 🚀 Запуск примеров

```bash
# Vue3 пример (http://localhost:3001)
npm run example:vue3

# Pure JS + Vite (http://localhost:3002)
npm run example:pure-js

# API Usage (http://localhost:3003)
npm run example:api-usage

# CDN версия (http://localhost:3004)
npm run example:cdn
```

### 🎯 Доступные примеры

| Компонент | Порт | Описание |
|-----------|------|----------|
| **Основной dev-сервер** | 3000 | Разработка основного пакета (`npm run dev`) |
| **Vue3** | 3001 | Полноценное Vue3 приложение с SFC компонентами |
| **Pure JS (Vite)** | 3002 | Чистый JavaScript с современной сборкой |
| **API Usage** | 3003 | Использование только API без готового UI |
| **Pure JS (CDN)** | 3004 | Без сборки, для легаси проектов |

📖 **[Подробная документация примеров →](./examples/README.md)**  
🔗 **[О фиксированных портах разработки →](./examples/DEV_URLS.md)**

## 🎯 Режимы работы BlockBuilder

### 🎨 С автоматическим UI (по умолчанию)
```javascript
// ✅ ПРАВИЛЬНО - для большинства случаев
import { BlockBuilder } from 'block-builder'

const blockBuilder = new BlockBuilder({
  containerId: 'my-app',
  blockConfigs: blockConfigs
  // autoRender: true по умолчанию
})
// Автоматически рендерит готовый UI с кнопками, формами, валидацией
```

### 🔧 Только API (без UI)
```javascript
// ✅ Для продвинутых пользователей
import { BlockBuilder } from 'block-builder'

const blockBuilder = new BlockBuilder({
  containerId: 'my-app',
  blockConfigs: blockConfigs,
  autoRender: false // Отключаем UI
})
// Только API - создавайте свой UI
```

## 🎯 Преимущества чистой архитектуры

- **Тестируемость** - легко мокать порты
- **Независимость** - core не зависит от infrastructure
- **Гибкость** - легко менять реализации
- **Чистота** - четкое разделение ответственности

## 📄 Лицензия

MIT
