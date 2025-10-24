# API Select - Pure JS (Vite) Пример

## 🎯 Описание

Демонстрация работы **API Select** функционала в чистом JavaScript проекте с Vite.

## 📦 Блок: Список новостей из API

Блок `newsList` демонстрирует использование `api-select` для выбора элементов из удаленного API.

### Особенности блока

1. **Главная новость** (`featuredNewsId`)
   - Одиночный выбор (`multiple: false`)
   - Обязательное поле
   - Выбор из списка новостей через API

2. **Список новостей** (`newsIds`)
   - Множественный выбор (`multiple: true`)
   - Обязательное поле
   - Минимум 2 новости должны быть выбраны
   - Отображение выбранных элементов в виде тегов

3. **Настройки отображения**
   - Заголовок секции
   - Показывать дату
   - Количество колонок (1-3)
   - Цвет фона и текста

## 🔌 Mock API

Для демонстрации используется встроенный Mock API сервер:
- **Endpoint**: `http://localhost:3002/api/news`
- **Методы**: GET, POST
- **Данные**: 15 моковых новостей
- **Параметры**: `search`, `page`, `limit`

### Формат ответа

```json
{
  "data": [
    { "id": 1, "name": "Новость 1: ...", "title": "...", "date": "2025-01-15" }
  ],
  "total": 15,
  "page": 1,
  "hasMore": true
}
```

## 🚀 Запуск примера

```bash
# Из корня проекта
npm run example:vite

# Откроется http://localhost:3002
```

## 💡 Использование в коде

### Конфигурация блока

```javascript
// src/block-config.js
export const blockConfigs = {
  newsList: {
    title: '📰 Список новостей из API',
    icon: '📰',
    render: {
      kind: 'html',
      template: (props) => {
        // HTML шаблон с использованием props
        const featuredNewsId = props.featuredNewsId;
        const newsIds = props.newsIds || [];
        // ...
      }
    },
    fields: [
      // API Select - одиночный выбор
      {
        field: 'featuredNewsId',
        type: 'api-select',
        apiSelectConfig: {
          url: 'http://localhost:3002/api/news',
          method: 'GET',
          multiple: false,
          placeholder: 'Начните вводить для поиска...',
          limit: 10,
          debounceMs: 300
        }
      },
      // API Select - множественный выбор
      {
        field: 'newsIds',
        type: 'api-select',
        apiSelectConfig: {
          url: 'http://localhost:3002/api/news',
          method: 'GET',
          multiple: true,
          placeholder: 'Выберите новости...',
          limit: 10
        }
      }
    ]
  }
}
```

### Инициализация BlockBuilder

```javascript
// src/main.js
import './style.css'
import '../../../src/ui/styles/index.scss' // Импорт стилей BlockBuilder
import { BlockBuilder } from 'block-builder'
import { blockConfigs } from './block-config.js'

const blockBuilder = new BlockBuilder({
  containerId: 'block-builder-container',
  blockConfigs: blockConfigs,
  theme: 'light',
  locale: 'ru'
})
```

## 🎨 Рендеринг

Pure JS использует **ApiSelectControlRenderer** для рендеринга API Select полей:

- Автоматически создается при инициализации формы
- Управляется через `BlockUIController`
- Все события обрабатываются в чистом JS
- Стили идентичны Vue3 версии

## ✨ Функционал

✅ **Поиск с debounce** - задержка 300ms перед отправкой запроса
✅ **Пагинация** - кнопка "Загрузить еще"
✅ **Single/Multiple select** - одиночный и множественный выбор
✅ **Кнопка toggle** - открытие/закрытие выпадашки
✅ **Закрытие по клику вне области** - корректное управление dropdown
✅ **Сохранение фокуса** - фокус не теряется при загрузке
✅ **Валидация** - проверка обязательных полей и минимального количества

## 📂 Структура файлов

```
examples/pure-js-vite/
├── src/
│   ├── main.js              # Инициализация BlockBuilder
│   ├── block-config.js      # Конфигурация блоков
│   └── style.css            # Стили примера
├── mock-api-server.js       # Mock API сервер
├── vite.config.js           # Конфигурация Vite + Mock API
├── index.html               # HTML страница
└── README-API-SELECT.md     # Эта документация
```

## 🔧 Кастомизация

### Изменение API endpoint

```javascript
apiSelectConfig: {
  url: 'https://your-api.com/items',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token'
  }
}
```

### Настройка текстов

```javascript
apiSelectConfig: {
  placeholder: 'Ваш placeholder...',
  loadingText: 'Идет загрузка...',
  noResultsText: 'Ничего не найдено',
  errorText: 'Произошла ошибка'
}
```

### Параметры поиска и пагинации

```javascript
apiSelectConfig: {
  limit: 20,              // Элементов на страницу
  debounceMs: 500,        // Задержка поиска (ms)
  minSearchLength: 3      // Минимум символов для поиска
}
```

## 🎯 Следующие шаги

1. **Подключите реальный API** - замените Mock API на ваш бэкенд
2. **Загружайте данные в блоке** - используйте выбранные ID для запросов
3. **Кастомизируйте отображение** - измените HTML шаблон под ваши нужды
4. **Добавьте обработку ошибок** - улучшите UX при проблемах с API

## 📚 См. также

- [API-SELECT-IMPLEMENTATION.md](../../API-SELECT-IMPLEMENTATION.md) - полная документация
- [Vue3 пример](../vue3/README-API-SELECT.md) - аналогичный функционал для Vue3
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - архитектура проекта

---

**Дата:** 24 октября 2025
**Версия:** 1.0.0

