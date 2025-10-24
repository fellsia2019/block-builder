# API Select - Полная реализация

## 📋 Обзор

Реализован полнофункциональный компонент **API Select** для выбора элементов из удаленного API с поиском и пагинацией.

## ✅ Реализованный функционал

### Основные возможности
- ✅ **Поиск с debounce** - задержка перед отправкой запроса
- ✅ **Пагинация** - подгрузка данных порциями ("Загрузить еще")
- ✅ **Single/Multiple select** - одиночный и множественный выбор
- ✅ **Кнопка-стрелка** для открытия/закрытия выпадашки
- ✅ **Закрытие по клику вне области** (capture phase)
- ✅ **Сохранение фокуса** при загрузке данных
- ✅ **Очистка/восстановление** поля поиска при закрытии
- ✅ **Валидация** - поддержка правил валидации
- ✅ **Кастомизация** - настройка текстов, лимитов, debounce

### UI компоненты
1. **Vue3 компонент** (`ApiSelectField.vue`) - для Vue3 проектов
2. **Pure JS рендерер** (`ApiSelectControlRenderer.ts`) - для проектов без фреймворков

## 🏗 Архитектура (Clean Architecture)

### Core (Ядро)
```
src/core/
├── types/form.ts           # Типы и интерфейсы
├── ports/HttpClient.ts     # Интерфейс HTTP клиента
└── use-cases/
    └── ApiSelectUseCase.ts # Бизнес-логика
```

### Infrastructure (Инфраструктура)
```
src/infrastructure/
└── http/
    └── FetchHttpClient.ts  # Реализация HTTP клиента
```

### UI (Интерфейс)
```
src/ui/
├── components/
│   └── ApiSelectField.vue         # Vue3 компонент
├── services/
│   ├── ApiSelectControlRenderer.ts # Pure JS рендерер
│   └── FormBuilder.ts             # Генератор HTML форм
├── controllers/
│   └── BlockUIController.ts       # Контроллер UI
└── styles/components/
    └── _api-select-control.scss   # Стили
```

## 🎯 Ключевые улучшения

### 1. Правильное закрытие dropdown
```typescript
// Capture phase - обработчик срабатывает первым
document.addEventListener('click', handleClickOutside, true);

const handleClickOutside = (event: MouseEvent) => {
  if (!isDropdownOpen) return;

  const target = event.target as HTMLElement;
  if (wrapper && !wrapper.contains(target)) {
    closeDropdown();
  }
};
```

**Почему работает:**
- **Capture phase** - событие обрабатывается до того, как дойдет до target
- Нет `stopPropagation()` - события нормально всплывают
- Проверка `contains()` - определяет клик внутри или снаружи

### 2. Сохранение фокуса при загрузке
```typescript
const fetchData = async () => {
  const hadFocus = document.activeElement === searchInput;

  loading = true;
  // ... загрузка данных ...
  loading = false;

  if (hadFocus) {
    await nextTick(); // Vue
    // или setTimeout(() => ..., 0); // Pure JS
    searchInput.focus();
  }
};
```

### 3. Очистка поля при закрытии
```typescript
const closeDropdown = () => {
  isDropdownOpen = false;

  // Для single select восстанавливаем выбранное значение
  if (!isMultiple && selectedItems.length > 0) {
    searchQuery = selectedItems[0].name;
  } else if (!isMultiple) {
    searchQuery = '';
  }
};
```

### 4. Кнопка toggle
```html
<button
  class="bb-api-select__toggle"
  :class="{ 'bb-api-select__toggle--open': isDropdownOpen }"
  @click="toggleDropdown"
>
  ▼
</button>
```

```scss
.bb-api-select__toggle {
  position: absolute;
  right: 8px;
  transition: all 0.2s;

  &--open {
    transform: rotate(180deg); // Анимация поворота
  }
}
```

## 📝 Конфигурация блока

### Пример в block-config.js
```javascript
{
  type: 'newsList',
  name: 'Список новостей (API)',
  icon: '📰',
  component: NewsListBlock,
  fields: [
    {
      field: 'featuredNewsId',
      label: 'Главная новость',
      type: 'api-select',
      rules: [{ type: 'required', message: 'Выберите главную новость' }],
      apiSelectConfig: {
        url: '/api/news',
        method: 'GET',
        multiple: false,
        placeholder: 'Начните вводить для поиска...',
        limit: 20,
        debounceMs: 300,
        minSearchLength: 0
      }
    },
    {
      field: 'newsIds',
      label: 'Список новостей для отображения',
      type: 'api-select',
      rules: [
        { type: 'required', message: 'Выберите хотя бы одну новость' },
        { type: 'minLength', value: 3, message: 'Выберите минимум 3 новости' }
      ],
      apiSelectConfig: {
        url: '/api/news',
        method: 'GET',
        multiple: true,
        placeholder: 'Поиск новостей...',
        limit: 10
      }
    }
  ]
}
```

### Параметры apiSelectConfig
```typescript
interface IApiSelectConfig {
  url: string;                  // URL API (обязательно)
  method?: 'GET' | 'POST';      // HTTP метод (по умолчанию GET)
  headers?: Record<string, string>; // Дополнительные заголовки
  multiple?: boolean;           // Множественный выбор (по умолчанию false)
  limit?: number;               // Кол-во элементов на страницу (по умолчанию 20)
  debounceMs?: number;          // Задержка поиска в мс (по умолчанию 300)
  minSearchLength?: number;     // Мин. длина поиска (по умолчанию 0)
  placeholder?: string;         // Placeholder для input
  loadingText?: string;         // Текст при загрузке
  noResultsText?: string;       // Текст когда нет результатов
  errorText?: string;           // Текст при ошибке
}
```

## 🔌 API формат

### Запрос
```
GET /api/news?search=текст&page=1&limit=20
```

### Ответ
```json
{
  "data": [
    { "id": 1, "name": "Новость 1" },
    { "id": 2, "name": "Новость 2" }
  ],
  "total": 15,
  "page": 1,
  "hasMore": true
}
```

## 🎨 Стили

Все стили с БЭМ методологией в `src/ui/styles/components/_api-select-control.scss`:
- `.bb-api-select` - корневой элемент
- `.bb-api-select__wrapper` - обертка для input и dropdown
- `.bb-api-select__input` - поле ввода
- `.bb-api-select__toggle` - кнопка-стрелка
- `.bb-api-select__dropdown` - выпадающий список
- `.bb-api-select__item` - элемент списка
- `.bb-api-select__tag` - тег выбранного элемента (multiple)

## 🧪 Примеры использования

### Vue3 проект
```javascript
// examples/vue3/src/block-config.js
import NewsListBlock from './components/NewsListBlock.vue';

export const blockConfigs = {
  newsList: {
    title: '📰 Список новостей из API',
    render: { kind: 'component', framework: 'vue', component: NewsListBlock },
    fields: [
      {
        field: 'newsIds',
        type: 'api-select',
        apiSelectConfig: {
          url: 'http://localhost:3001/api/news',
          multiple: true,
          limit: 10
        }
      }
    ]
  }
};
```

### Pure JS (Vite)
```javascript
// examples/pure-js-vite/src/main.js
import './style.css'
import '../../../src/ui/styles/index.scss' // Импорт стилей BlockBuilder
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'

// examples/pure-js-vite/src/block-config.js
export const blockConfigs = {
  newsList: {
    title: '📰 Список новостей из API',
    render: {
      kind: 'html',
      template: (props) => {
        // HTML шаблон с использованием props.newsIds
        return `<div>...</div>`;
      }
    },
    fields: [
      {
        field: 'newsIds',
        type: 'api-select',
        apiSelectConfig: {
          url: 'http://localhost:3002/api/news',
          multiple: true,
          limit: 10
        }
      }
    ]
  }
};

// ApiSelectControlRenderer автоматически создается через BlockUIController
```

### Pure JS (CDN)
```html
<!-- examples/pure-js-cdn/index.html -->
<script src="https://unpkg.com/block-builder"></script>
<script>
  // Аналогично Pure JS (Vite)
  // ApiSelectControlRenderer автоматически создается через BlockUIController
</script>
```

## 🛠 Управление ресурсами

### Очистка при размонтировании
```typescript
// Vue3
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});

// Pure JS
class ApiSelectControlRenderer {
  destroy() {
    document.removeEventListener('click', this.handleClickOutsideBound, true);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}
```

### Автоматическая очистка в BlockUIController
```typescript
private cleanupApiSelectControls(): void {
  this.apiSelectRenderers.forEach((renderer) => {
    renderer.destroy(); // Очищаем обработчики событий
  });
  this.apiSelectRenderers.clear();
}
```

## 📦 Экспорты

```typescript
// src/index.ts
export type {
  IApiSelectConfig,
  IApiSelectItem,
  IApiSelectResponse,
  IApiRequestParams,
  THttpMethod,
  IHttpClient,
  IHttpResponse,
  IHttpError,
  IHttpRequestOptions
};

export {
  ApiSelectUseCase,
  FetchHttpClient,
  ApiSelectControlRenderer
};

// src/vue.ts (для Vue3 проектов)
export { default as ApiSelectField } from './ui/components/ApiSelectField.vue';
```

## 🚀 Запуск примеров

```bash
# Vue3 (с Mock API на порту 3001)
npm run example:vue3
# http://localhost:3001
# Mock API: http://localhost:3001/api/news

# Pure JS Vite (с Mock API на порту 3002)
npm run example:vite
# http://localhost:3002
# Mock API: http://localhost:3002/api/news

# Pure JS CDN
npm run example:cdn
# http://localhost:3003
```

**📝 Примечание:** Каждый пример имеет свой собственный Mock API сервер, работающий на соответствующем порту.

## ✨ Финальный статус

### Функционал
✅ Все функции реализованы
✅ Работает в Vue3 и Pure JS
✅ Правильная архитектура (Clean Architecture)
✅ Закрытие по клику вне области работает корректно
✅ Фокус сохраняется при загрузке
✅ Поле очищается/восстанавливается при закрытии
✅ Кнопка toggle с анимацией поворота
✅ Нет утечек памяти (правильная очистка)

### Примеры
✅ Vue3 - с реактивным компонентом NewsListBlock
✅ Pure JS Vite - с HTML render и Mock API
✅ Mock API для локальной разработки
✅ Документация для каждого примера
✅ Независимые Mock API серверы для каждого примера

---

**Дата:** 24 октября 2025
**Версия:** 1.0.0

