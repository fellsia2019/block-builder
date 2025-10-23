# Унификация UI между Vue3 и Pure JS

## 🎯 Цель
Обеспечить идентичный внешний вид и поведение UI компонентов Block Builder в Vue3 и Pure JS версиях.

## ✅ Решение
Единая SCSS система с БЭМ методологией для всех UI элементов.

---

## 📦 Архитектура

### 1. Общие SCSS стили (src/ui/styles/)

```
src/ui/styles/
├── _variables.scss      # CSS переменные (цвета, размеры, шрифты)
├── _base.scss          # Базовые стили + утилиты
├── components/
│   ├── _buttons.scss   # Кнопки (миксины + БЭМ)
│   ├── _blocks.scss    # Блоки (БЭМ с модификаторами)
│   ├── _forms.scss     # Формы (инпуты, селекты, чекбоксы)
│   └── _modals.scss    # Модальные окна + анимации
├── index.scss          # Главный файл (@use импорты)
└── styles.ts           # TypeScript wrapper для Pure JS
```

### 2. Использование в разных средах

#### Vue3 компоненты:
```vue
<style lang="scss">
@use '../styles/index.scss';
</style>
```

#### Pure JS (через StyleManager):
```typescript
import styles from '../styles/styles'; // Compiled CSS string
styleManager.injectStyles(); // Вставка в <head>
```

---

## 🎨 БЭМ Классы

### Кнопки

**Базовый класс:** `.block-builder-btn`

**Модификаторы:**
- `.block-builder-btn--primary` — основная кнопка (синяя)
- `.block-builder-btn--secondary` — вторичная (серая)
- `.block-builder-btn--danger` — опасная (красная)

**Пример:**
```html
<button class="block-builder-btn block-builder-btn--primary">
  📝 Добавить блок
</button>
```

**SCSS:**
```scss
// src/ui/styles/components/_buttons.scss
.block-builder-btn {
  @include button-base();
  
  &--primary { @include button-variant(primary); }
  &--secondary { @include button-variant(secondary); }
  &--danger { @include button-variant(danger); }
}
```

---

### Контрольные кнопки

**Базовый класс:** `.block-builder-control-btn`

**Особенности:**
- Квадратная форма 32×32px
- Прозрачный фон
- Серая рамка
- Эмодзи иконки

**Пример:**
```html
<button class="block-builder-control-btn" title="Редактировать">
  ✏️
</button>
```

---

### Блоки

**Базовый класс:** `.block-builder-block`

**Модификаторы:**
- `.locked` — заблокированный блок (серый фон)
- `.hidden` — скрытый блок (пунктирная рамка)

**Структура:**
```html
<div class="block-builder-block">
  <div class="block-builder-block-header">
    <div class="block-builder-block-info">...</div>
    <div class="block-builder-block-controls">...</div>
  </div>
  <div class="block-builder-block-content">...</div>
</div>
```

**SCSS:**
```scss
// src/ui/styles/components/_blocks.scss
.block-builder-block {
  background: white;
  border: 1px solid var(--border-color);
  
  &.locked {
    background: var(--disabled-bg);
    opacity: 0.7;
  }
  
  &.hidden {
    border-style: dashed;
    opacity: 0.5;
  }
  
  &-header { /* ... */ }
  &-info { /* ... */ }
  &-controls { /* ... */ }
  &-content { /* ... */ }
}
```

---

### Формы

**Группа полей:** `.block-builder-form-group`
**Метка:** `.block-builder-form-label`
**Поле ввода:** `.block-builder-form-control`

**Чекбокс:**
```html
<label class="block-builder-form-checkbox">
  <input type="checkbox" class="block-builder-form-checkbox-input">
  <span class="block-builder-form-checkbox-label">Текст</span>
</label>
```

**SCSS:**
```scss
// src/ui/styles/components/_forms.scss
.block-builder-form {
  &-group { /* ... */ }
  &-label { /* ... */ }
  &-control {
    @include input-base();
    
    &:focus { @include input-focus(); }
    &[disabled] { @include input-disabled(); }
  }
  
  &-checkbox { /* ... */ }
}
```

---

### Модальные окна

**Оверлей:** `.block-builder-modal`
**Контент:** `.block-builder-modal-content`
**Шапка:** `.block-builder-modal-header`
**Тело:** `.block-builder-modal-body`
**Футер:** `.block-builder-modal-footer`
**Закрытие:** `.block-builder-modal-close`

**Структура:**
```html
<div class="block-builder-modal">
  <div class="block-builder-modal-content">
    <div class="block-builder-modal-header">
      <h3>Заголовок</h3>
      <button class="block-builder-modal-close">×</button>
    </div>
    <div class="block-builder-modal-body">
      <!-- Форма -->
    </div>
    <div class="block-builder-modal-footer">
      <!-- Кнопки -->
    </div>
  </div>
</div>
```

**Анимация:**
```scss
// src/ui/styles/components/_modals.scss
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { transform: translateY(-50px); }
  to { transform: translateY(0); }
}

.block-builder-modal {
  animation: modalFadeIn 0.2s ease-out;
  
  &-content {
    animation: modalSlideIn 0.3s ease-out;
  }
}
```

---

## 🔧 SCSS Миксины

### Кнопки

```scss
// src/ui/styles/components/_buttons.scss
@mixin button-base() {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
}

@mixin button-variant($type) {
  @if $type == 'primary' {
    background: var(--primary-color);
    color: white;
    &:hover { background: var(--primary-hover); }
  }
  @else if $type == 'secondary' {
    background: var(--secondary-color);
    color: var(--text-color);
    &:hover { background: var(--secondary-hover); }
  }
  // ...
}
```

### Инпуты

```scss
// src/ui/styles/components/_forms.scss
@mixin input-base() {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  transition: border-color 0.2s;
}

@mixin input-focus() {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

@mixin input-disabled() {
  background: var(--disabled-bg);
  cursor: not-allowed;
}
```

---

## 📊 CSS Переменные

### Цвета

```scss
// src/ui/styles/_variables.scss
:root {
  // Основные
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --secondary-color: #95a5a6;
  --danger-color: #e74c3c;
  
  // Состояния
  --success-color: #2ecc71;
  --warning-color: #f39c12;
  --error-color: #e74c3c;
  
  // Нейтральные
  --text-color: #2c3e50;
  --text-muted: #7f8c8d;
  --border-color: #ddd;
  --bg-light: #f8f9fa;
  --disabled-bg: #ecf0f1;
  
  // Размеры
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  --border-radius: 8px;
}
```

---

## 🚀 Сборка

### Rollup конфигурация

```javascript
// rollup.config.cjs
const postcss = require('rollup-plugin-postcss');
const sass = require('sass');

module.exports = {
  // ...
  plugins: [
    // ...
    postcss({
      extract: false, // Встраиваем CSS в JS
      modules: false,
      inject: false,
      use: [['sass', { sass, compiler: 'sass' }]], // Dart Sass
    }),
  ],
};
```

### Package.json

```json
{
  "devDependencies": {
    "rollup-plugin-postcss": "^4.0.2",
    "sass": "^1.83.4"
  },
  "files": [
    "dist",
    "src/ui/styles/**/*.scss"
  ]
}
```

---

## ✅ Результаты

### Было (до унификации):

❌ **Vue3:**
```html
<button class="toolbar-button">Добавить</button>
<div class="block-item">...</div>
<input class="form-field">
```

❌ **Pure JS:**
```html
<button class="bb-btn bb-btn-primary">Добавить</button>
<div class="bb-block">...</div>
<input class="bb-input">
```

❌ **Дублирование:** ~4KB CSS кода  
❌ **Разный внешний вид:** цвета, отступы, размеры

---

### Стало (после унификации):

✅ **Vue3 и Pure JS (одинаково):**
```html
<button class="block-builder-btn block-builder-btn--primary">Добавить</button>
<div class="block-builder-block">...</div>
<input class="block-builder-form-control">
```

✅ **Единый SCSS:** ~30KB минифицированный CSS  
✅ **Идентичный UI:** цвета, отступы, анимации  
✅ **БЭМ методология:** предсказуемые классы  
✅ **Миксины SCSS:** переиспользуемый код

---

## 🧪 Тестирование

### Запуск примеров:

```bash
# Корневой dev-сервер
npm run dev

# Откройте в браузере:
http://localhost:3000/examples/vue3/
http://localhost:3000/examples/pure-js-vite/
```

### Проверка:

1. **Визуальное сравнение** — оба примера должны выглядеть идентично
2. **Инспектор браузера** — проверьте классы (должны быть одинаковые)
3. **DevTools** — проверьте вычисленные стили (должны совпадать)

---

## 📝 Чеклист унификации

- ✅ Создана структура `src/ui/styles/`
- ✅ Миграция с CSS на SCSS
- ✅ Внедрены БЭМ классы
- ✅ Созданы SCSS миксины
- ✅ Добавлены CSS переменные
- ✅ Обновлен `BlockBuilder.vue`
- ✅ Обновлен `UIRenderer.ts`
- ✅ Обновлен `FormBuilder.ts`
- ✅ Настроен Rollup для SCSS
- ✅ Обновлен `StyleManager.ts`
- ✅ Проверены примеры
- ✅ Создана документация

---

## 🔮 Дальнейшие улучшения

1. **Темизация** — поддержка темной темы через CSS переменные
2. **Кастомизация** — API для переопределения переменных пользователем
3. **A11y** — улучшение доступности (ARIA, focus states)
4. **Анимации** — плавные переходы между состояниями
5. **Адаптивность** — медиа-запросы для мобильных устройств

---

**Дата:** 23 октября 2025  
**Автор:** AI Assistant  
**Версия:** 1.0.0
