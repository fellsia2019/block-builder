# API Select - Работа с внешним API

## Описание

API Select - это новый тип поля формы, который позволяет выбирать элементы из внешнего API пользователя. Это особенно полезно когда нужно выбрать контент (новости, статьи, продукты и т.д.) из существующей базы данных бэкенда.

## Возможности

- ✅ Загрузка данных из внешнего API (GET или POST)
- ✅ Поиск по элементам на стороне бэкенда
- ✅ Пагинация результатов
- ✅ Одиночный или множественный выбор
- ✅ Настраиваемый debounce для поиска
- ✅ Кастомизация полей и параметров запроса
- ✅ Поддержка различных форматов ответов API

## Как использовать

### 1. Настройка Mock API Server

Для демонстрации функционала в примере используется mock API server:

```bash
cd examples/vue3
npm run dev
```

Mock API будет доступен по адресу: `http://localhost:3001/api/news`

### 2. Конфигурация поля в блоке

#### Одиночный выбор:

```javascript
{
  field: 'featuredNewsId',
  label: 'Главная новость',
  type: 'api-select',
  rules: [{ type: 'required', message: 'Выберите главную новость' }],
  defaultValue: null,
  apiSelectConfig: {
    url: 'http://localhost:3001/api/news',
    method: 'GET',
    multiple: false, // Одиночный выбор
    placeholder: 'Начните вводить для поиска...',
    searchParam: 'search',
    pageParam: 'page',
    limitParam: 'limit',
    limit: 10,
    debounceMs: 300,
    idField: 'id',
    nameField: 'name',
    minSearchLength: 0,
    loadingText: 'Загрузка...',
    noResultsText: 'Ничего не найдено',
    errorText: 'Ошибка загрузки'
  }
}
```

#### Множественный выбор:

```javascript
{
  field: 'newsIds',
  label: 'Список новостей',
  type: 'api-select',
  rules: [{ type: 'required', message: 'Выберите хотя бы одну новость' }],
  defaultValue: [],
  apiSelectConfig: {
    url: 'http://localhost:3001/api/news',
    method: 'GET',
    multiple: true, // Множественный выбор
    // ... остальные параметры
  }
}
```

### 3. Формат ответа от API

#### Стандартный формат (рекомендуется):

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

#### Альтернативные форматы:

Если ваш API возвращает данные в другом формате, используйте параметры:

- `dataPath` - путь к массиву данных (например, `'data.items'` или `'results'`)
- `idField` - название поля ID (по умолчанию `'id'`)
- `nameField` - название поля для отображения (по умолчанию `'name'`)
- `responseMapper` - функция для преобразования ответа

```javascript
apiSelectConfig: {
  url: 'https://api.example.com/articles',
  dataPath: 'results.items', // Путь к массиву
  idField: 'article_id', // Другое название поля ID
  nameField: 'title', // Другое название поля для отображения

  // Или используйте кастомный маппер:
  responseMapper: (response) => ({
    data: response.articles.map(a => ({
      id: a.article_id,
      name: a.title
    })),
    total: response.count,
    hasMore: response.has_next_page
  })
}
```

### 4. Параметры конфигурации

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `url` | string | - | **Обязательный.** URL вашего API |
| `method` | 'GET' \| 'POST' | 'GET' | HTTP метод запроса |
| `multiple` | boolean | false | Множественный выбор |
| `headers` | object | {} | Дополнительные HTTP заголовки |
| `searchParam` | string | 'search' | Имя параметра для поискового запроса |
| `pageParam` | string | 'page' | Имя параметра для номера страницы |
| `limitParam` | string | 'limit' | Имя параметра для лимита элементов |
| `limit` | number | 20 | Количество элементов на странице |
| `debounceMs` | number | 300 | Задержка для поиска (мс) |
| `minSearchLength` | number | 0 | Минимальная длина поискового запроса |
| `idField` | string | 'id' | Поле ID в элементах |
| `nameField` | string | 'name' | Поле name в элементах |
| `dataPath` | string | - | Путь к данным в ответе |
| `placeholder` | string | 'Начните вводить...' | Плейсхолдер поля |
| `loadingText` | string | 'Загрузка...' | Текст во время загрузки |
| `noResultsText` | string | 'Ничего не найдено' | Текст когда нет результатов |
| `errorText` | string | 'Ошибка загрузки' | Текст при ошибке |
| `responseMapper` | function | - | Функция преобразования ответа |

### 5. Использование выбранных данных в компоненте

```vue
<template>
  <div v-for="newsId in props.newsIds" :key="newsId">
    <!-- Загрузите полные данные по ID с вашего API -->
  </div>
</template>

<script setup>
const props = defineProps({
  newsIds: {
    type: Array,
    default: () => []
  }
})

// Загрузка полных данных новостей
async function loadNews() {
  const response = await fetch(`/api/news/bulk?ids=${props.newsIds.join(',')}`)
  const news = await response.json()
  // Используйте данные для отображения
}
</script>
```

## Пример использования

Полный пример можно найти в файлах:

- `examples/vue3/src/block-config.js` - конфигурация блока (блок `newsList`)
- `examples/vue3/src/components/NewsListBlock.vue` - компонент отображения
- `examples/vue3/mock-api-server.js` - mock API server

## Требования к API

Ваш API должен:

1. Принимать параметры поиска, пагинации
2. Возвращать массив объектов с `id` и `name` (или кастомными полями)
3. (Опционально) Возвращать информацию о пагинации (`total`, `hasMore`)

### Пример минимального API:

```javascript
app.get('/api/items', (req, res) => {
  const { search, page = 1, limit = 10 } = req.query

  let items = getAllItems()

  // Поиск
  if (search) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Пагинация
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedItems = items.slice(start, end)

  res.json({
    data: paginatedItems,
    total: items.length,
    hasMore: end < items.length
  })
})
```

## CORS

Если ваш API находится на другом домене, убедитесь что CORS настроен правильно:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
```

## Чистая архитектура

Реализация следует принципам чистой архитектуры:

- **Core** (`ApiSelectUseCase`) - бизнес-логика
- **Infrastructure** (`FetchHttpClient`) - реализация HTTP клиента
- **UI** (`ApiSelectField.vue`, `ApiSelectControlRenderer`) - пользовательский интерфейс

## Тестирование

Для тестирования без реального API:

1. Используйте встроенный mock server (запускается автоматически с `npm run dev`)
2. Или используйте сервисы типа JSONPlaceholder, Mockoon и т.д.

