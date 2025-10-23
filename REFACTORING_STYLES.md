# Рефакторинг стилей Block Builder

## Проблема
Дублирование стилей между `StyleManager.ts` (для чистого JS) и Vue компонентами (для Vue3).

## Решение
Создана единая система стилей с использованием CSS переменных и модульной структуры.

## Структура стилей

```
src/ui/styles/
├── variables.css          # CSS переменные (цвета, размеры, шрифты)
├── base.css              # Базовые стили и утилиты
├── components/
│   ├── buttons.css       # Стили кнопок по БЭМ
│   ├── blocks.css        # Стили блоков
│   ├── forms.css         # Стили форм
│   └── modals.css        # Стили модальных окон
├── index.css             # Главный файл (импортирует все)
├── styles.ts             # TypeScript экспорт для JS бандла
└── styles.d.ts           # Type declarations для CSS модулей
```

## Преимущества

### 1. **Единый источник истины**
- Один набор стилей для JS и Vue3
- Легко поддерживать и обновлять
- Нет дублирования кода

### 2. **CSS переменные для кастомизации**
Пользователи могут легко переопределить стили:

```css
:root {
  --bb-color-primary: #667eea;
  --bb-color-primary-dark: #764ba2;
  --bb-spacing-lg: 16px;
  /* и т.д. */
}
```

### 3. **Модульная структура**
- Четкое разделение по компонентам
- Легко найти нужные стили
- Возможность импортировать только нужные части

### 4. **Следование БЭМ**
Все классы следуют методологии БЭМ:
- `.block-builder-btn` - блок
- `.block-builder-btn--primary` - модификатор
- `.block-builder-modal__header` - элемент

### 5. **Поддержка tree-shaking**
При необходимости можно импортировать только нужные CSS модули.

## Использование

### Для чистого JS
Стили автоматически встраиваются в JS бандл через `StyleManager`:

```javascript
import { BlockBuilder } from 'block-builder';

const builder = new BlockBuilder({
  containerId: 'app',
  blockConfigs: { /* ... */ }
});
// Стили инъектируются автоматически
```

### Для Vue3
Стили импортируются в компонентах:

```vue
<template>
  <!-- ... -->
</template>

<style>
@import '../styles/index.css';

/* Специфичные стили компонента */
</style>
```

## Технические детали

### Сборка
- **Rollup** с `rollup-plugin-postcss` для обработки CSS
- **PostCSS** с `postcss-import` для обработки @import директив
- CSS встраивается в JS бандл (не создается отдельный файл)

### Конфигурация

**rollup.config.cjs:**
```javascript
postcss({
  extensions: ['.css'],
  inject: false,
  extract: false,
  minimize: true,
  modules: false,
  plugins: [postcssImport()],
})
```

## Миграция

### До
**StyleManager.ts** - 350+ строк встроенных стилей  
**BlockBuilder.vue** - 300+ строк дублирующихся стилей

### После  
**src/ui/styles/** - модульная структура CSS  
**StyleManager.ts** - 30 строк (импорт и инъекция)  
**BlockBuilder.vue** - импорт + 60 строк специфичных стилей

## Кастомизация для пользователей

Пользователи могут кастомизировать внешний вид, переопределив CSS переменные:

```css
:root {
  /* Изменить основные цвета */
  --bb-color-primary: #ff6b6b;
  --bb-color-primary-dark: #c92a2a;
  
  /* Изменить размеры */
  --bb-spacing-lg: 20px;
  --bb-radius-md: 8px;
  
  /* Изменить шрифты */
  --bb-font-family: 'Arial', sans-serif;
}
```

Или импортировать отдельные модули в свои стили:

```css
@import 'block-builder/dist/styles/variables.css';
@import 'block-builder/dist/styles/components/buttons.css';

/* Свои переопределения */
.block-builder-btn--primary {
  background: linear-gradient(to right, #ff6b6b, #c92a2a);
}
```

## Результаты
- ✅ Устранено дублирование стилей
- ✅ Улучшена поддерживаемость
- ✅ Легкая кастомизация через CSS переменные
- ✅ Модульная структура
- ✅ Следование БЭМ методологии
- ✅ Работает как для чистого JS, так и для Vue3

