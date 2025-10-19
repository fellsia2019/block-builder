# 🏗️ Naberika - Блочный конструктор с чистой архитектурой

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
npm install naberika
```

### Использование

#### HTML шаблоны
```typescript
import { 
  BlockManagementUseCase,
  MemoryBlockRepositoryImpl,
  MemoryComponentRegistry,
  CreateBlockDto
} from 'naberika';

// Создание use case с поддержкой Vue3 компонентов
const blockRepository = new MemoryBlockRepositoryImpl();
const componentRegistry = new MemoryComponentRegistry();
const blockManagement = new BlockManagementUseCase(blockRepository, componentRegistry);

// Создание блока с HTML шаблоном
const createDto: CreateBlockDto = {
  type: 'text',
  settings: { fontSize: 16, color: '#333' },
  props: { content: 'Hello World!' },
  template: '<div style="font-size: {{ settings.fontSize }}px; color: {{ settings.color }};">{{ props.content }}</div>',
  position: { x: 100, y: 100 },
  size: { width: 300, height: 50 }
};

const block = await blockManagement.createBlock(createDto);
```

#### Vue3 компоненты
```typescript
// Регистрация Vue3 компонента
const CustomButton = {
  name: 'CustomButton',
  props: ['text', 'variant'],
  template: '<button :class="`btn btn-${variant}`">{{ text }}</button>'
};

blockManagement.registerComponent('CustomButton', CustomButton);

// Создание блока с Vue3 компонентом
const vueBlock = await blockManagement.createVueBlock(
  'button',
  'CustomButton',
  { text: 'Click me!', variant: 'primary' },
  { backgroundColor: '#007bff' },
  { x: 100, y: 100 },
  { width: 150, height: 40 }
);
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

### BlockManagementUseCase
```typescript
// Создание блока
await blockManagement.createBlock(createDto);

// Получение блока
await blockManagement.getBlock(blockId);

// Обновление блока
await blockManagement.updateBlock(blockId, updates);

// Перемещение блока
await blockManagement.moveBlock(blockId, position);

// Удаление блока
await blockManagement.deleteBlock(blockId);

// Дублирование блока
await blockManagement.duplicateBlock(blockId);

// Vue3 компоненты
await blockManagement.registerComponent(name, component);
await blockManagement.createVueBlock(type, componentName, props, settings, position, size);
await blockManagement.updateVueComponent(blockId, componentName, componentProps);
```

### DTO
```typescript
interface CreateBlockDto {
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  template?: string; // HTML шаблон
  component?: string; // Vue3 компонент
  componentProps?: Record<string, any>; // Пропсы для Vue3
  position?: { x: number; y: number; z?: number };
  size?: { width: number; height: number };
  visible?: boolean;
  locked?: boolean;
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
- `simple-example.ts` - базовый пример с Vue3 компонентами
- `vue3-components-example.ts` - расширенный пример Vue3 компонентов
- `index.html` - интерактивная демонстрация
- `vue3-example.vue` - Vue3 компонент

## 🎯 Преимущества чистой архитектуры

- **Тестируемость** - легко мокать порты
- **Независимость** - core не зависит от infrastructure
- **Гибкость** - легко менять реализации
- **Чистота** - четкое разделение ответственности

## 📄 Лицензия

MIT