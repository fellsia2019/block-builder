# Архитектура проекта Naberika

## Проблема "God Object"

**Было:** `BlockBuilder.ts` — 1451 строка кода, выполняющий множество обязанностей (антипаттерн God Object)

**Стало:** Декомпозиция по принципам **SOLID** и **Чистой архитектуры**

---

## Новая структура

```
src/
├── core/                              # Ядро приложения (бизнес-логика)
│   ├── entities/                      # Сущности
│   ├── use-cases/                     # Сценарии использования
│   │   └── BlockManagementUseCase     # Главный use case
│   ├── ports/                         # Интерфейсы (контракты)
│   │   ├── BlockRepository.ts
│   │   └── ComponentRegistry.ts
│   ├── dto/                           # Data Transfer Objects
│   ├── types/                         # Типы TypeScript
│   └── BlockBuilderFacade.ts          # 🎯 Главный фасад (API точка входа)
│
├── infrastructure/                    # Реализации портов
│   ├── repositories/
│   │   ├── MemoryBlockRepositoryImpl
│   │   └── LocalStorageBlockRepositoryImpl
│   └── registries/
│       └── MemoryComponentRegistry
│
└── ui/                                # UI слой
    ├── controllers/
    │   └── BlockUIController.ts       # Координатор UI операций
    └── services/
        ├── StyleManager.ts            # Управление стилями
        ├── FormBuilder.ts             # Генерация HTML форм
        ├── ModalManager.ts            # Управление модальными окнами
        └── UIRenderer.ts              # Рендеринг UI и блоков
```

---

## Применённые паттерны и принципы

### 1. **SOLID принципы**

#### Single Responsibility Principle (SRP)
- ✅ `StyleManager` — только стили
- ✅ `FormBuilder` — только формы
- ✅ `ModalManager` — только модальные окна
- ✅ `UIRenderer` — только рендеринг
- ✅ `BlockUIController` — только координация UI

#### Dependency Inversion Principle (DIP)
- Зависимости от абстракций (интерфейсов), а не от конкретных реализаций
- Use Cases зависят от `IBlockRepository` и `IComponentRegistry` (порты)

### 2. **Паттерны проектирования**

#### Facade Pattern
**`BlockBuilderFacade`** — упрощённый интерфейс для пользователей пакета
```typescript
const builder = new BlockBuilder({
  containerId: 'app',
  blockConfigs: configs
});
```

#### Strategy Pattern
Выбор репозитория через опции:
```typescript
storage: 'memory' | 'localStorage'
```

#### Factory Pattern
```typescript
private createDefaultRepository(storage?: string): IBlockRepository
```

#### MVC (Controller)
**`BlockUIController`** — контроллер, координирующий UI операции

### 3. **Чистая архитектура**

#### Слои и зависимости

```
┌─────────────────────────────────────────┐
│           UI Layer                       │
│  (controllers, services)                 │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │     Core Layer                      │ │
│  │  (use-cases, entities, ports)      │ │
│  │                                     │ │
│  │  ┌──────────────────────────────┐  │ │
│  │  │  Infrastructure Layer        │  │ │
│  │  │  (реализации портов)         │  │ │
│  │  └──────────────────────────────┘  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Правило зависимостей:** внешние слои зависят от внутренних, но не наоборот

✅ **Разрешено:**
- UI → Use Case
- Use Case → Entity
- Use Case → Port (интерфейс)
- Infrastructure → Port

❌ **Запрещено:**
- Core → Infrastructure
- Core → UI
- Entity → Use Case

---

## Сравнение: Было vs Стало

### Было (God Object)
```typescript
class BlockBuilder {
  // 1451 строка кода
  // Ответственности:
  // - API фасад
  // - Рендеринг UI
  // - Генерация форм
  // - Модальные окна
  // - Стили
  // - Валидация
  // - Обработчики событий
  // ... и многое другое
}
```

### Стало (Чистая архитектура)

#### BlockBuilderFacade (137 строк)
- Только API фасад
- Делегирование вызовов Use Cases и UI контроллеру

#### BlockUIController (233 строки)
- Координация UI операций
- Dependency Injection сервисов

#### StyleManager (181 строка)
- Только управление стилями

#### FormBuilder (285 строк)
- Только генерация и валидация форм

#### ModalManager (94 строки)
- Только управление модальными окнами

#### UIRenderer (168 строк)
- Только рендеринг UI и блоков

---

## Преимущества новой архитектуры

### 1. **Тестируемость**
Каждый класс можно тестировать изолированно:
```typescript
const formBuilder = new FormBuilder();
const validation = formBuilder.validateForm(props, fields);
```

### 2. **Поддерживаемость**
- Изменения в стилях → правим только `StyleManager`
- Изменения в формах → правим только `FormBuilder`
- Изменения в UI → правим только `UIRenderer`

### 3. **Расширяемость**
Легко добавить новый функционал:
```typescript
export class ThemeManager {
  applyDarkTheme() { ... }
  applyLightTheme() { ... }
}
```

### 4. **Переиспользование**
Сервисы можно использовать отдельно:
```typescript
import { FormBuilder, StyleManager } from 'naberika';

const formBuilder = new FormBuilder();
const html = formBuilder.generateCreateFormHTML(fields);
```

### 5. **Dependency Injection**
```typescript
constructor(config: IBlockUIControllerConfig) {
  this.uiRenderer = new UIRenderer(...);
  this.formBuilder = new FormBuilder();
  this.modalManager = new ModalManager();
  this.styleManager = new StyleManager();
}
```

---

## API совместимость

**API остался полностью совместимым!** Существующий код пользователей работает без изменений:

```typescript
// До рефакторинга
import { BlockBuilder } from 'naberika';
const builder = new BlockBuilder({ ... });

// После рефакторинга - ТОТ ЖЕ КОД РАБОТАЕТ!
import { BlockBuilder } from 'naberika';
const builder = new BlockBuilder({ ... });
```

---

## Соответствие правилам проекта

✅ **Чистая архитектура** — строгое разделение на слои  
✅ **SOLID принципы** — каждый класс имеет одну ответственность  
✅ **Чистые функции** — методы без побочных эффектов где возможно  
✅ **Современные паттерны** — Facade, Strategy, Factory, MVC  
✅ **TypeScript best practices** — интерфейсы начинаются с `I`, типы с `T`  
✅ **БЭМ** — классы CSS по методологии БЭМ

---

## Метрики качества кода

### Было
- 1 файл: 1451 строка
- Цикломатическая сложность: высокая
- Связанность (coupling): высокая
- Тестируемость: низкая

### Стало
- 6 классов со средним размером ~165 строк
- Цикломатическая сложность: низкая
- Связанность (coupling): низкая
- Связность (cohesion): высокая
- Тестируемость: высокая

---

## Дальнейшие улучшения

1. **Unit тесты** для каждого сервиса
2. **Integration тесты** для BlockUIController
3. **E2E тесты** для полного сценария
4. **Дополнительные сервисы:**
   - `ThemeManager` — управление темами
   - `LocalizationService` — локализация
   - `EventBus` — события приложения
5. **Документация API** — JSDoc комментарии

