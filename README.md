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
```typescript
import { 
  BlockManagementUseCase,
  MemoryBlockRepositoryImpl,
  CreateBlockDto
} from 'naberika';

// Создание use case (единственный вход в ядро)
const blockRepository = new MemoryBlockRepositoryImpl();
const blockManagement = new BlockManagementUseCase(blockRepository);

// Создание блока
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
```

### DTO
```typescript
interface CreateBlockDto {
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  template: string;
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
- `simple-example.ts` - базовый пример
- `index.html` - интерактивная демонстрация
- `vue3-example.vue` - Vue3 компонент

## 🎯 Преимущества чистой архитектуры

- **Тестируемость** - легко мокать порты
- **Независимость** - core не зависит от infrastructure
- **Гибкость** - легко менять реализации
- **Чистота** - четкое разделение ответственности

## 📄 Лицензия

MIT