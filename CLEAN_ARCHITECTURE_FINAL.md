# ✅ Чистая архитектура: Правильное разделение пакета и пользовательского кода

## Главный принцип

**Пакет НЕ должен знать о бизнес-логике пользователя!**

---

## ❌ Что было неправильно (все варианты)

### Вариант 1: Хардкод в пакете
```typescript
// src/ui/services/UIRenderer.ts (КОД ПАКЕТА)
if (componentName === 'CardListBlock') {  // ❌ ПЛОХО
  this.setupCardClickHandlers(container);
}
```

### Вариант 2: Специфичный метод в пакете
```typescript
// src/core/BlockBuilderFacade.ts (КОД ПАКЕТА)
showCardDetailModal(card: CardData): void {  // ❌ ПЛОХО
  // Логика показа деталей КАРТОЧКИ в пакете
}
```

**Почему плохо:**
- ❌ `showCardDetailModal` — это специфичная логика для **карточек**
- ❌ Пакет не должен знать про "детали карточки"
- ❌ Завтра появится `ProductDetailModal`, `UserDetailModal` — добавлять методы в пакет?
- ❌ Нарушение принципа единой ответственности

---

## ✅ Правильное решение

### Разделение ответственности

```
┌───────────────────────────────────────────────────┐
│  ПАКЕТ (универсальный)                             │
│                                                    │
│  ✅ Предоставляет управление БЛОКАМИ              │
│  ✅ CRUD операции: create, update, delete          │
│  ✅ UI для редактирования блоков                   │
│  ❌ НЕ знает про "карточки", "продукты" и т.д.    │
└───────────────────────────────────────────────────┘
                      ↑
                      │ использует
                      │
┌───────────────────────────────────────────────────┐
│  ПОЛЬЗОВАТЕЛЬСКИЙ КОД                              │
│                                                    │
│  ✅ CardListBlock.js — компонент пользователя     │
│  ✅ Своя модалка с деталями карточки               │
│  ✅ Своя бизнес-логика                             │
└───────────────────────────────────────────────────┘
```

---

## 📝 Правильная реализация

### 1. Пакет остаётся универсальным

```typescript
// src/core/BlockBuilderFacade.ts
export class BlockBuilderFacade {
  // ✅ Универсальные методы для работы с блоками
  async createBlock(data: ICreateBlockDto): Promise<IBlockDto>
  async updateBlock(id: string, updates: IUpdateBlockDto): Promise<IBlockDto | null>
  async deleteBlock(id: string): Promise<boolean>
  
  // ✅ Универсальные UI методы
  closeModal(): void  // Закрыть текущую модалку пакета
  
  // ❌ НЕТ специфичных методов типа:
  // showCardDetailModal() 
  // showProductModal()
  // showUserProfileModal()
}
```

### 2. Пользователь реализует свою логику

```javascript
// src/examples/vue3/components/CardListBlock.js
// ✅ Это КОД ПОЛЬЗОВАТЕЛЯ, не пакета!

export default Vue.defineComponent({
  name: 'CardListBlock',
  
  // ✅ Пользователь управляет своим состоянием
  data() {
    return {
      selectedCard: null,
      showModal: false  // ← своя модалка!
    };
  },
  
  methods: {
    // ✅ Пользователь решает, что делать при клике
    handleCardClick(event, card) {
      event.preventDefault();
      this.selectedCard = card;
      this.showModal = true;  // ← своя логика!
    },
    
    closeModal() {
      this.showModal = false;
    },
    
    openLink(link) {
      window.open(link, '_blank');
      this.closeModal();
    }
  },
  
  template: `
    <div class="card-list-block">
      <!-- Карточки -->
      <div @click="handleCardClick($event, card)">...</div>
      
      <!-- ✅ Своя модалка в шаблоне компонента -->
      <div v-if="showModal" class="card-modal-overlay">
        <div class="card-modal-content">
          <h3>{{ selectedCard?.title }}</h3>
          <img :src="selectedCard.image" />
          <p>{{ selectedCard.text }}</p>
          <button @click="openLink(selectedCard.link)">
            {{ selectedCard.button }}
          </button>
        </div>
      </div>
    </div>
  `
});
```

---

## 🎯 Что экспортирует пакет

### Публичный API пакета

```typescript
export class BlockBuilder {
  // ===== БЛОКИ =====
  createBlock(data: ICreateBlockDto): Promise<IBlockDto>
  updateBlock(id: string, updates: IUpdateBlockDto): Promise<IBlockDto | null>
  deleteBlock(id: string): Promise<boolean>
  duplicateBlock(id: string): Promise<IBlockDto | null>
  getAllBlocks(): Promise<IBlockDto[]>
  getBlock(id: string): Promise<IBlockDto | null>
  
  // ===== КОМПОНЕНТЫ =====
  registerComponent(name: string, component: any): void
  getComponent(name: string): any | null
  
  // ===== UI УТИЛИТЫ (для модалок форм пакета) =====
  closeModal(): void  // Закрыть модалку редактирования блока
  submitModal(): void // Submit формы редактирования
  
  // ===== КОНФИГУРАЦИЯ =====
  getBlockConfigs(): Record<string, any>
  getAvailableBlockTypes(): string[]
  
  // ===== УТИЛИТЫ =====
  exportBlocks(): Promise<string>
  importBlocks(jsonData: string): Promise<boolean>
}
```

**НЕТ в пакете:**
- ❌ `showCardDetailModal()` — это бизнес-логика карточек
- ❌ `showProductModal()` — это бизнес-логика продуктов
- ❌ Любых других доменно-специфичных методов

---

## 📚 Примеры других пользовательских компонентов

### ProductListBlock (гипотетический)

```javascript
// Пользователь создаёт свой компонент БЕЗ зависимости от пакета
export default {
  name: 'ProductListBlock',
  data() {
    return {
      selectedProduct: null,
      showProductModal: false  // ← своя модалка!
    };
  },
  methods: {
    handleProductClick(product) {
      this.selectedProduct = product;
      this.showProductModal = true;  // ← своя логика!
    }
  },
  template: `
    <div>
      <!-- Своя модалка для продуктов -->
      <div v-if="showProductModal">
        <h3>{{ selectedProduct.name }}</h3>
        <div>Цена: {{ selectedProduct.price }}</div>
        <button @click="addToCart(selectedProduct)">В корзину</button>
      </div>
    </div>
  `
};
```

### UserProfileBlock (гипотетический)

```javascript
// Другой пользовательский компонент со своей логикой
export default {
  name: 'UserProfileBlock',
  data() {
    return {
      showEditModal: false  // ← своя модалка!
    };
  },
  methods: {
    editProfile() {
      this.showEditModal = true;  // ← своя логика!
    }
  }
};
```

---

## 🔄 Сравнение подходов

### ❌ Неправильно

```typescript
// Пакет содержит доменную логику
export class BlockBuilder {
  showCardDetailModal(card: Card): void { ... }      // ❌ Знает про карточки
  showProductModal(product: Product): void { ... }   // ❌ Знает про продукты
  showUserProfile(user: User): void { ... }          // ❌ Знает про юзеров
}
```

**Проблемы:**
- Пакет раздувается с каждым новым типом сущности
- Нарушение SRP (Single Responsibility Principle)
- Невозможно переиспользовать пакет в других проектах

### ✅ Правильно

```typescript
// Пакет универсальный
export class BlockBuilder {
  createBlock(data: ICreateBlockDto): Promise<IBlockDto>  // ✅ Универсально
  updateBlock(id: string, updates: IUpdateBlockDto): Promise<IBlockDto | null>
  deleteBlock(id: string): Promise<boolean>
}
```

```javascript
// Пользователь сам реализует свою логику
export default {
  data() {
    return {
      showModal: false  // ← своя модалка для своих нужд
    };
  }
};
```

**Преимущества:**
- ✅ Пакет остаётся компактным и универсальным
- ✅ Соблюдение SRP
- ✅ Легко переиспользовать в любых проектах
- ✅ Пользователь не ограничен API пакета

---

## 📐 Границы ответственности

```
┌─────────────────────────────────────────────────────┐
│                    ПАКЕТ                             │
├─────────────────────────────────────────────────────┤
│ Что делает:                                          │
│ ✅ Управление блоками (CRUD)                         │
│ ✅ UI для редактирования блоков                      │
│ ✅ Регистрация компонентов                           │
│ ✅ Рендеринг блоков                                  │
│                                                      │
│ Что НЕ делает:                                       │
│ ❌ Не знает про "карточки", "продукты", "юзеров"    │
│ ❌ Не содержит бизнес-логику пользователя           │
│ ❌ Не диктует, как показывать детали сущностей      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              ПОЛЬЗОВАТЕЛЬСКИЙ КОД                    │
├─────────────────────────────────────────────────────┤
│ Что делает:                                          │
│ ✅ Создаёт свои компоненты (CardListBlock, etc)     │
│ ✅ Реализует свою бизнес-логику                      │
│ ✅ Создаёт свои модалки и UI                         │
│ ✅ Решает, как показывать детали                     │
│                                                      │
│ Что использует:                                      │
│ ✅ API пакета для регистрации компонентов            │
│ ✅ API пакета для управления блоками                 │
└─────────────────────────────────────────────────────┘
```

---

## 🎓 Принципы чистой архитектуры

### 1. Dependency Inversion Principle (DIP)
```
❌ Пакет → Бизнес-логика пользователя
✅ Пользователь → API пакета
```

### 2. Single Responsibility Principle (SRP)
- **Пакет:** управление блоками
- **Пользователь:** бизнес-логика (карточки, продукты, модалки)

### 3. Open/Closed Principle (OCP)
- Пакет открыт для расширения (API)
- Пакет закрыт для модификации (не нужно менять код)

### 4. Separation of Concerns
- **Пакет:** технический фреймворк
- **Пользователь:** бизнес-приложение

---

## ✅ Итог

### Что в пакете
```typescript
// ✅ УНИВЕРСАЛЬНОЕ
- Управление блоками
- CRUD операции
- Рендеринг компонентов
- UI для редактирования блоков
```

### Что у пользователя
```javascript
// ✅ СПЕЦИФИЧНОЕ
- CardListBlock.js
- Модалка с деталями карточки
- Бизнес-логика карточек
- Обработчики событий
```

### Граница
```
ПАКЕТ (универсальный)  |  ПОЛЬЗОВАТЕЛЬ (специфичный)
-----------------------|---------------------------
Инструменты            |  Использование инструментов
API                    |  Бизнес-логика
Технический слой       |  Прикладной слой
```

---

## 🎉 Вывод

**Правильная чистая архитектура = чёткое разделение универсального и специфичного**

- Пакет предоставляет **инструменты** (универсальные)
- Пользователь реализует **логику** (специфичную)
- Никаких доменно-специфичных методов в пакете!

**Теперь пакет действительно универсален и может использоваться в любых проектах!** ✅

