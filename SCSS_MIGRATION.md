# Миграция стилей на SCSS

## Обзор
Стили Block Builder мигрированы с CSS на SCSS для использования всех возможностей препроцессора.

## Что изменилось

### Структура файлов
```
src/ui/styles/
├── _variables.scss      # CSS переменные (partial)
├── _base.scss          # Базовые стили (partial)
├── components/
│   ├── _buttons.scss   # Стили кнопок (partial)
│   ├── _blocks.scss    # Стили блоков (partial)
│   ├── _forms.scss     # Стили форм (partial)
│   └── _modals.scss    # Стили модалок (partial)
├── index.scss          # Главный файл
├── styles.ts           # TypeScript экспорт
└── styles.d.ts         # Type declarations
```

### Использование возможностей SCSS

#### 1. **Вложенность селекторов**
Было (CSS):
```css
.block-builder-btn { }
.block-builder-btn--primary { }
.block-builder-btn--secondary { }
```

Стало (SCSS):
```scss
.block-builder-btn {
  &--primary { }
  &--secondary { }
}
```

#### 2. **Миксины**
Переиспользуемые стили:

```scss
@mixin btn-base {
  padding: 10px 20px;
  border: none;
  border-radius: var(--bb-radius-md);
  cursor: pointer;
  // ...
}

@mixin btn-variant($bg-color, $hover-color) {
  background: $bg-color;
  &:hover:not(:disabled) {
    background: $hover-color;
  }
}

.block-builder-btn {
  @include btn-base;
  
  &--primary {
    @include btn-variant(var(--bb-color-primary), var(--bb-color-primary-dark));
  }
}
```

#### 3. **Утилиты с вложенностью**
Было (CSS):
```css
.bb-mt-sm { margin-top: var(--bb-spacing-sm); }
.bb-mt-md { margin-top: var(--bb-spacing-md); }
.bb-mt-lg { margin-top: var(--bb-spacing-lg); }
```

Стало (SCSS):
```scss
.bb-mt {
  &-sm { margin-top: var(--bb-spacing-sm); }
  &-md { margin-top: var(--bb-spacing-md); }
  &-lg { margin-top: var(--bb-spacing-lg); }
}
```

#### 4. **Вложенные псевдо-классы и элементы**
```scss
.block-builder-modal-close {
  background: none;
  border: none;
  
  &:hover {
    background: var(--bb-bg-secondary);
    color: var(--bb-text-primary);
  }
}
```

#### 5. **Современный синтаксис импортов**
Используем `@use` вместо устаревшего `@import`:

```scss
@use './variables';
@use './base';
@use './components/buttons';
```

## Преимущества SCSS

### 1. **Улучшенная читаемость**
- Вложенность отражает структуру HTML/BEM
- Легче понять иерархию стилей

### 2. **Переиспользование кода**
- Миксины для общих паттернов
- Функции для вычислений
- Наследование через `@extend`

### 3. **Меньше дублирования**
- Один миксин вместо копирования стилей
- Переменные SCSS + CSS переменные

### 4. **Лучшая организация**
- Partial файлы (с префиксом `_`)
- Модульная структура
- Четкие зависимости через `@use`

## Технические детали

### Сборка
**Rollup конфигурация:**
```javascript
postcss({
  extensions: ['.css', '.scss'],
  inject: false,
  extract: false,
  minimize: true,
  modules: false,
  use: ['sass'], // SASS препроцессор
  plugins: [postcssImport()],
})
```

### Зависимости
```json
{
  "devDependencies": {
    "sass": "^1.x.x",
    "rollup-plugin-postcss": "^4.x.x",
    "postcss-import": "^16.x.x"
  }
}
```

### Использование в Vue компонентах
```vue
<style lang="scss">
@use '../styles/index.scss';

/* Специфичные стили компонента */
.my-component {
  // ...
}
</style>
```

### Использование в чистом JS
Стили автоматически встраиваются в JS бандл через `StyleManager`:
```typescript
import styles from './index.scss'; // Компилируется в CSS строку
```

## Кастомизация

### Переопределение переменных
```scss
:root {
  /* Цвета */
  --bb-color-primary: #ff6b6b;
  --bb-color-primary-dark: #c92a2a;
  
  /* Размеры */
  --bb-spacing-lg: 20px;
  --bb-radius-md: 8px;
}
```

### Создание своих миксинов
```scss
@use 'block-builder/dist/styles/variables';

@mixin my-custom-button {
  @include btn-base;
  background: linear-gradient(to right, #ff6b6b, #c92a2a);
}
```

## Результаты

✅ **Современный стек:** SCSS с `@use`/`@forward`  
✅ **Миксины:** Переиспользуемые паттерны стилей  
✅ **Вложенность:** БЭМ методология + SCSS синтаксис  
✅ **Читаемость:** Улучшенная структура и организация  
✅ **Поддержка:** CSS переменные + возможности SCSS  
✅ **Размер:** Минимизированный CSS в бандле  

## Миграция для пользователей

Если вы используете Block Builder и хотите переопределить стили:

### Было (CSS):
```css
@import 'block-builder/dist/styles/index.css';

.block-builder-btn--primary {
  background: red;
}
```

### Стало (SCSS):
```scss
@use 'block-builder/dist/styles/index.scss';

.block-builder-btn {
  &--primary {
    background: red;
  }
}
```

Или просто переопределите CSS переменные (работает без изменений):
```css
:root {
  --bb-color-primary: red;
}
```

