# Граф зависимостей

## Архитектура слоёв

```
┌──────────────────────────────────────────────────────────────────────┐
│                          ПОЛЬЗОВАТЕЛЬ                                 │
│                                ↓                                      │
│              import { BlockBuilder } from 'naberika'                  │
└──────────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────────┐
│                     FACADE (точка входа)                              │
│                                                                       │
│                     BlockBuilderFacade                                │
│                           ↓         ↓                                 │
│                   Use Case    UI Controller                           │
└──────────────────────────────────────────────────────────────────────┘
                     ↓                    ↓
┌─────────────────────────┐   ┌──────────────────────────────────────┐
│    CORE (ядро)          │   │    UI (представление)                 │
│                         │   │                                       │
│  BlockManagementUseCase │   │    BlockUIController                  │
│           ↓             │   │            ↓                          │
│    ┌──────────────┐     │   │    ┌──────────────┐                  │
│    │  Entities    │     │   │    │  Services:   │                  │
│    │  - Block     │     │   │    │  - UIRenderer│                  │
│    └──────────────┘     │   │    │  - FormBuilder                  │
│           ↓             │   │    │  - ModalManager                 │
│    ┌──────────────┐     │   │    │  - StyleManager                 │
│    │  Ports       │     │   │    └──────────────┘                  │
│    │  (interface) │     │   │                                       │
│    └──────────────┘     │   └───────────────────────────────────────┘
└─────────────────────────┘
            ↓
┌──────────────────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE (реализации)                              │
│                                                                       │
│    MemoryBlockRepositoryImpl                                          │
│    LocalStorageBlockRepositoryImpl                                    │
│    MemoryComponentRegistry                                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Детальный граф зависимостей

### 1. BlockBuilderFacade (главный фасад)

```typescript
BlockBuilderFacade
    ├── зависит от → BlockManagementUseCase
    ├── зависит от → BlockUIController
    ├── зависит от → IBlockRepository (интерфейс)
    ├── зависит от → IComponentRegistry (интерфейс)
    ├── создаёт → MemoryBlockRepositoryImpl | LocalStorageBlockRepositoryImpl
    └── создаёт → MemoryComponentRegistry
```

### 2. BlockManagementUseCase (бизнес-логика)

```typescript
BlockManagementUseCase
    ├── зависит от → IBlockRepository (интерфейс)
    ├── зависит от → IComponentRegistry (интерфейс)
    ├── использует → CreateBlockUseCase
    ├── использует → UpdateBlockUseCase
    ├── использует → DeleteBlockUseCase
    ├── использует → DuplicateBlockUseCase
    └── использует → ComponentManagementUseCase
```

### 3. BlockUIController (координатор UI)

```typescript
BlockUIController
    ├── зависит от → BlockManagementUseCase
    ├── создаёт → UIRenderer
    ├── создаёт → FormBuilder
    ├── создаёт → ModalManager
    └── создаёт → StyleManager
```

### 4. UIRenderer (рендеринг)

```typescript
UIRenderer
    ├── зависит от → IBlockDto
    ├── зависит от → IComponentRegistry
    └── отвечает за → DOM манипуляции
```

### 5. FormBuilder (формы)

```typescript
FormBuilder
    ├── зависит от → IFieldConfig
    ├── генерирует → HTML формы
    └── выполняет → валидация данных
```

### 6. ModalManager (модальные окна)

```typescript
ModalManager
    ├── зависит от → IModalOptions
    ├── управляет → DOM модального окна
    └── обрабатывает → события (submit, cancel)
```

### 7. StyleManager (стили)

```typescript
StyleManager
    ├── инъектирует → CSS стили
    └── управляет → стилями компонентов
```

---

## Правила зависимостей (Clean Architecture)

### ✅ Разрешённые зависимости

1. **UI → Core**
   ```
   BlockUIController → BlockManagementUseCase
   ```

2. **Core → Entities**
   ```
   BlockManagementUseCase → Block (entity)
   ```

3. **Core → Ports (интерфейсы)**
   ```
   BlockManagementUseCase → IBlockRepository
   ```

4. **Infrastructure → Ports**
   ```
   MemoryBlockRepositoryImpl implements IBlockRepository
   ```

### ❌ Запрещённые зависимости

1. **Core ❌→ Infrastructure**
   ```
   ❌ BlockManagementUseCase → MemoryBlockRepositoryImpl
   ✅ BlockManagementUseCase → IBlockRepository (интерфейс)
   ```

2. **Core ❌→ UI**
   ```
   ❌ BlockManagementUseCase → UIRenderer
   ```

3. **Entities ❌→ Use Cases**
   ```
   ❌ Block → BlockManagementUseCase
   ```

---

## Направление зависимостей

```
┌─────────────┐
│   UI Layer  │
└──────┬──────┘
       ↓ (зависит от)
┌──────────────┐
│  Core Layer  │
└──────┬───────┘
       ↓ (зависит от)
┌────────────────────┐
│  Infrastructure    │
└────────────────────┘
```

**Правило:** Внешние слои зависят от внутренних, но НЕ наоборот

---

## Инъекция зависимостей (DI)

### BlockBuilderFacade конструктор

```typescript
constructor(options: IBlockBuilderOptions) {
  // Создаём репозиторий (Strategy pattern)
  this.repository = options.repository || 
                   this.createDefaultRepository(options.storage);
  
  // Создаём реестр компонентов
  this.componentRegistry = options.componentRegistry || 
                          new MemoryComponentRegistry();
  
  // Инъектируем зависимости в Use Case (DIP)
  this.useCase = new BlockManagementUseCase(
    this.repository,
    this.componentRegistry
  );
  
  // Создаём UI контроллер с инъекцией Use Case
  this.uiController = new BlockUIController({
    containerId: options.containerId,
    blockConfigs: options.blockConfigs,
    useCase: this.useCase  // ← Dependency Injection
  });
}
```

### BlockUIController конструктор

```typescript
constructor(config: IBlockUIControllerConfig) {
  // Инъекция Use Case через конфигурацию
  this.config = config;
  
  // Создание сервисов (Service Locator pattern)
  this.uiRenderer = new UIRenderer({...});
  this.formBuilder = new FormBuilder();
  this.modalManager = new ModalManager();
  this.styleManager = new StyleManager();
}
```

---

## Типы зависимостей

### 1. Зависимость от интерфейса (DIP)
```typescript
// ✅ Хорошо - зависим от абстракции
class BlockManagementUseCase {
  constructor(
    private repository: IBlockRepository  // ← интерфейс
  ) {}
}
```

### 2. Зависимость от конкретного класса
```typescript
// ⚠️ Только для сервисов без альтернатив
class BlockUIController {
  private formBuilder = new FormBuilder();  // ← конкретный класс
}
```

### 3. Инъекция через конструктор
```typescript
// ✅ Лучший способ для тестируемости
constructor(private useCase: BlockManagementUseCase) {
  this.useCase = useCase;
}
```

---

## Порядок инициализации

```
1. BlockBuilderFacade создаётся пользователем
   ↓
2. Создаётся Repository (Memory | LocalStorage)
   ↓
3. Создаётся ComponentRegistry
   ↓
4. Создаётся BlockManagementUseCase (инъекция Repository + Registry)
   ↓
5. Создаётся BlockUIController (инъекция UseCase)
   ↓
6. BlockUIController создаёт сервисы:
   - UIRenderer
   - FormBuilder
   - ModalManager
   - StyleManager
   ↓
7. UI рендерится (если autoRender = true)
```

---

## Пример использования

```typescript
// Пользовательский код
const builder = new BlockBuilder({
  containerId: 'app',
  blockConfigs: configs,
  storage: 'localStorage'  // ← Strategy pattern
});

// Внутри происходит:
// 1. new LocalStorageBlockRepositoryImpl()
// 2. new BlockManagementUseCase(repository, registry)
// 3. new BlockUIController({ useCase })
// 4. BlockUIController создаёт все сервисы
// 5. UI автоматически рендерится
```

---

## Выводы

✅ **Слабая связанность (Low Coupling)** — классы зависят от интерфейсов  
✅ **Высокая связность (High Cohesion)** — каждый класс имеет одну обязанность  
✅ **Инверсия зависимостей (DIP)** — зависим от абстракций  
✅ **Единственная ответственность (SRP)** — каждый класс делает одно дело  
✅ **Тестируемость** — легко мокировать зависимости  

