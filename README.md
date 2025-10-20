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

### Использование

#### Основной API (Рекомендуемый способ)
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

```bash
# Запуск тестов
npm test

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

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

Смотрите папку `src/examples/` для примеров использования:

### 🎯 Примеры использования
- **Vue3 Example** (`vue3/`):
  - `index.html` - правильное использование с Vue3 компонентами
  - `block-config.js` - конфигурация блоков с реальными Vue компонентами
  - `components/` - папка с Vue компонентами (TextBlock, ImageBlock, ButtonBlock, CardListBlock, HeroBlock)
- **Pure JS Example** (`pure-js/`):
  - `index.html` - правильное использование на чистом JavaScript
  - `block-config.js` - конфигурация с HTML шаблонами
- **API Only Example** (`api-usage/`):
  - `index.html` - использование только API без UI
  - `block-config.js` - минимальная конфигурация для API

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
