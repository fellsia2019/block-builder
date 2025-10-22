# BlockBuilder - API Usage Example

Пример использования программного API BlockBuilder без готового UI.

## ✅ Что демонстрирует этот пример

1. **Программный API** - прямое управление блоками без готового UI пакета
2. **Кастомный интерфейс** - полностью свой UI для управления блоками
3. **Прямой контроль** - создание, чтение, обновление, удаление блоков через API
4. **Гибкость** - интеграция в любой существующий проект

## Установка

```bash
# Из корня проекта
npm install

# Или только для этого примера
cd examples/api-usage-app
npm install
```

## Запуск

```bash
# Из корня проекта
npm run example:api-usage

# Или из директории примера
cd examples/api-usage-app
npm run dev
```

Приложение откроется на `http://localhost:3002`

## Структура

```
api-usage-app/
├── src/
│   ├── main.js               # Пример использования API
│   └── style.css             # Кастомные стили
├── index.html
├── vite.config.js
└── package.json
```

## Использование API

### Инициализация

```javascript
import { BlockBuilder } from 'block-builder'

const blockBuilder = new BlockBuilder({
  containerId: 'my-container',
  blockConfigs: blockConfigs,
  renderUI: false  // Отключаем автоматический UI
})
```

### Создание блока

```javascript
const newBlock = blockBuilder.createBlock({
  type: 'text',
  data: {
    content: 'Мой текст',
    fontSize: 16,
    color: '#333'
  }
})

console.log('Создан блок:', newBlock.id)
```

### Получение блока

```javascript
const block = blockBuilder.getBlock(blockId)
console.log('Блок:', block)
```

### Получение всех блоков

```javascript
const blocks = blockBuilder.getAllBlocks()
console.log('Все блоки:', blocks)
```

### Обновление блока

```javascript
blockBuilder.updateBlock(blockId, {
  content: 'Новый текст',
  fontSize: 20
})
```

### Удаление блока

```javascript
blockBuilder.deleteBlock(blockId)
```

### Дублирование блока

```javascript
const duplicatedBlock = blockBuilder.duplicateBlock(blockId)
```

## Когда использовать этот подход

✅ **Используйте API подход когда:**
- Нужен полностью кастомный UI
- Интеграция в существующий проект со своим дизайном
- Нужен полный контроль над UX
- Специфичные требования к интерфейсу

❌ **НЕ используйте когда:**
- Подходит готовый UI пакета
- Нужно быстро прототипировать
- Не требуется кастомизация интерфейса

## Основные методы API

| Метод | Описание | Возвращает |
|-------|----------|------------|
| `createBlock(config)` | Создать новый блок | Block object |
| `getBlock(id)` | Получить блок по ID | Block object или null |
| `getAllBlocks()` | Получить все блоки | Array of blocks |
| `updateBlock(id, data)` | Обновить данные блока | Updated block |
| `deleteBlock(id)` | Удалить блок | boolean |
| `duplicateBlock(id)` | Дублировать блок | New block object |

## Структура блока

```javascript
{
  id: 'unique-id',
  type: 'text',
  data: {
    content: 'Текст',
    fontSize: 16,
    color: '#333'
  },
  order: 0,
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
}
```

## Пример интеграции

### Интеграция с React

```javascript
import { useState, useEffect } from 'react'
import { BlockBuilder } from 'block-builder'

function MyApp() {
  const [blockBuilder] = useState(() => new BlockBuilder({
    containerId: 'blocks',
    blockConfigs: myConfigs,
    renderUI: false
  }))
  
  const [blocks, setBlocks] = useState([])
  
  useEffect(() => {
    setBlocks(blockBuilder.getAllBlocks())
  }, [])
  
  const addBlock = () => {
    const newBlock = blockBuilder.createBlock({
      type: 'text',
      data: { content: 'Новый блок' }
    })
    setBlocks(blockBuilder.getAllBlocks())
  }
  
  return (
    <div>
      <button onClick={addBlock}>Добавить блок</button>
      {blocks.map(block => (
        <div key={block.id}>{block.data.content}</div>
      ))}
    </div>
  )
}
```

### Интеграция с Vue

```vue
<template>
  <div>
    <button @click="addBlock">Добавить блок</button>
    <div v-for="block in blocks" :key="block.id">
      {{ block.data.content }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BlockBuilder } from 'block-builder'

const blockBuilder = new BlockBuilder({
  containerId: 'blocks',
  blockConfigs: myConfigs,
  renderUI: false
})

const blocks = ref([])

onMounted(() => {
  blocks.value = blockBuilder.getAllBlocks()
})

const addBlock = () => {
  blockBuilder.createBlock({
    type: 'text',
    data: { content: 'Новый блок' }
  })
  blocks.value = blockBuilder.getAllBlocks()
}
</script>
```

## Примечания

- Этот пример не попадает в npm публикацию пакета
- Используется для демонстрации программного API
- Показывает как интегрировать BlockBuilder в существующие проекты
- Полный контроль над UI и UX

## Дальнейшие шаги

1. Изучите API в консоли браузера
2. Экспериментируйте с методами
3. Интегрируйте в свой проект
4. Создайте свой уникальный UI

