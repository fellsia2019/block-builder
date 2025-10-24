# 📐 Spacing Control - Управление отступами блоков

Это руководство описывает, как использовать компонент `SpacingControl` для управления отступами блоков с поддержкой адаптивности по брекпоинтам.

## 🏗️ Универсальная архитектура

SpacingControl создан по принципам **чистой архитектуры** и работает в любом фреймворке:

- ✅ **Vue3** - готовый компонент
- ✅ **Pure JavaScript** - класс `SpacingControlRenderer`
- ✅ **Универсальные стили** - один SCSS файл для всех
- 🔄 **React/Angular/Svelte** - легко добавить обёртки

### Структура:
```
├── core/types/form.ts              # Типы (универсальные)
├── utils/spacingHelpers.ts         # Утилиты (универсальные)
├── ui/styles/components/_spacing-control.scss  # Стили (универсальные)
├── ui/services/SpacingControlRenderer.ts       # Pure JS
└── ui/components/SpacingControl.vue            # Vue3 обёртка
```

## 🎯 Возможности

- ✅ Управление 4 типами отступов: `padding-top`, `padding-bottom`, `margin-top`, `margin-bottom`
- ✅ Поддержка 3 базовых брекпоинтов: Desktop (по умолчанию), Tablet (1199px), Mobile (767px)
- ✅ Возможность добавления кастомных брекпоинтов
- ✅ Визуальный слайдер для каждого типа отступа
- ✅ Числовой инпут для точной настройки
- ✅ Превью CSS переменных в реальном времени
- ✅ Сохранение отступов как CSS переменные
- ✅ **Работает в любом фреймворке** (Vue, React, чистый JS)
- ✅ **Универсальные стили** - один файл для всех

## 📝 Пример использования

### 1. Добавление поля spacing в конфигурацию блока

```javascript
{
  field: 'spacing',
  label: 'Отступы блока',
  type: 'spacing',
  spacingConfig: {
    // Какие типы отступов доступны
    spacingTypes: ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'],
    
    // Диапазон значений
    min: 0,
    max: 200,
    step: 4,
    
    // Использовать базовые брекпоинты
    defaultBreakpoints: true,
    
    // Дополнительные кастомные брекпоинты (необязательно)
    breakpoints: [
      { name: 'wide', label: 'Широкий экран', maxWidth: 1920 }
    ]
  },
  defaultValue: {
    desktop: {
      'padding-top': 60,
      'padding-bottom': 60,
      'margin-top': 0,
      'margin-bottom': 20
    },
    tablet: {
      'padding-top': 40,
      'padding-bottom': 40,
      'margin-top': 0,
      'margin-bottom': 16
    },
    mobile: {
      'padding-top': 24,
      'padding-bottom': 24,
      'margin-top': 0,
      'margin-bottom': 12
    }
  }
}
```

### 2. Создание компонента блока

```vue
<template>
  <div 
    class="my-block"
    :style="computedStyles"
  >
    <!-- Контент блока -->
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    spacing: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const computedStyles = computed(() => {
      const styles = {};

      if (props.spacing && Object.keys(props.spacing).length > 0) {
        // Desktop (default)
        const desktop = props.spacing.desktop || {};
        if (desktop['padding-top']) styles['--spacing-padding-top'] = `${desktop['padding-top']}px`;
        if (desktop['padding-bottom']) styles['--spacing-padding-bottom'] = `${desktop['padding-bottom']}px`;
        if (desktop['margin-top']) styles['--spacing-margin-top'] = `${desktop['margin-top']}px`;
        if (desktop['margin-bottom']) styles['--spacing-margin-bottom'] = `${desktop['margin-bottom']}px`;

        // Tablet
        const tablet = props.spacing.tablet || {};
        if (tablet['padding-top']) styles['--spacing-padding-top-tablet'] = `${tablet['padding-top']}px`;
        if (tablet['padding-bottom']) styles['--spacing-padding-bottom-tablet'] = `${tablet['padding-bottom']}px`;
        if (tablet['margin-top']) styles['--spacing-margin-top-tablet'] = `${tablet['margin-top']}px`;
        if (tablet['margin-bottom']) styles['--spacing-margin-bottom-tablet'] = `${tablet['margin-bottom']}px`;

        // Mobile
        const mobile = props.spacing.mobile || {};
        if (mobile['padding-top']) styles['--spacing-padding-top-mobile'] = `${mobile['padding-top']}px`;
        if (mobile['padding-bottom']) styles['--spacing-padding-bottom-mobile'] = `${mobile['padding-bottom']}px`;
        if (mobile['margin-top']) styles['--spacing-margin-top-mobile'] = `${mobile['margin-top']}px`;
        if (mobile['margin-bottom']) styles['--spacing-margin-bottom-mobile'] = `${mobile['margin-bottom']}px`;
      }

      return styles;
    });

    return { computedStyles };
  }
};
</script>

<style scoped>
.my-block {
  /* Применяем отступы через CSS переменные */
  padding-top: var(--spacing-padding-top, 0);
  padding-bottom: var(--spacing-padding-bottom, 0);
  margin-top: var(--spacing-margin-top, 0);
  margin-bottom: var(--spacing-margin-bottom, 0);
}

/* Tablet */
@media (max-width: 1199px) {
  .my-block {
    padding-top: var(--spacing-padding-top-tablet, var(--spacing-padding-top, 0));
    padding-bottom: var(--spacing-padding-bottom-tablet, var(--spacing-padding-bottom, 0));
    margin-top: var(--spacing-margin-top-tablet, var(--spacing-margin-top, 0));
    margin-bottom: var(--spacing-margin-bottom-tablet, var(--spacing-margin-bottom, 0));
  }
}

/* Mobile */
@media (max-width: 767px) {
  .my-block {
    padding-top: var(--spacing-padding-top-mobile, var(--spacing-padding-top, 0));
    padding-bottom: var(--spacing-padding-bottom-mobile, var(--spacing-padding-bottom, 0));
    margin-top: var(--spacing-margin-top-mobile, var(--spacing-margin-top, 0));
    margin-bottom: var(--spacing-margin-bottom-mobile, var(--spacing-margin-bottom, 0));
  }
}
</style>
```

### 3. Использование утилит

BlockBuilder предоставляет утилиты для работы со spacing:

```typescript
import { 
  generateSpacingCSSVariables,
  generateSpacingCSS,
  validateSpacing,
  mergeSpacing
} from '@naberika/block-builder/utils/spacingHelpers';

// Генерация CSS переменных
const cssVars = generateSpacingCSSVariables(spacingData, 'my-block');

// Генерация CSS кода с медиа-запросами
const css = generateSpacingCSS(spacingData, '.my-block');

// Валидация spacing данных
const validation = validateSpacing(spacingData, 0, 200);

// Объединение нескольких spacing объектов
const merged = mergeSpacing(defaultSpacing, customSpacing);
```

## 🎨 Структура данных spacing

```typescript
{
  desktop: {
    'padding-top': 60,
    'padding-bottom': 60,
    'margin-top': 0,
    'margin-bottom': 20
  },
  tablet: {
    'padding-top': 40,
    'padding-bottom': 40,
    'margin-top': 0,
    'margin-bottom': 16
  },
  mobile: {
    'padding-top': 24,
    'padding-bottom': 24,
    'margin-top': 0,
    'margin-bottom': 12
  }
}
```

## 🔧 Кастомизация

### Добавление кастомных брекпоинтов

```javascript
spacingConfig: {
  defaultBreakpoints: true, // Сохранить базовые брекпоинты
  breakpoints: [
    { name: 'ultrawide', label: '4K', maxWidth: 2560 },
    { name: 'large', label: 'Большой', maxWidth: 1440 }
  ]
}
```

### Ограничение типов отступов

```javascript
spacingConfig: {
  spacingTypes: ['padding-top', 'padding-bottom'], // Только padding
  min: 0,
  max: 100,
  step: 8
}
```

## 📊 CSS переменные

Компонент генерирует следующие CSS переменные:

```css
/* Desktop (default) */
--spacing-padding-top: 60px;
--spacing-padding-bottom: 60px;
--spacing-margin-top: 0px;
--spacing-margin-bottom: 20px;

/* Tablet */
--spacing-padding-top-tablet: 40px;
--spacing-padding-bottom-tablet: 40px;
--spacing-margin-top-tablet: 0px;
--spacing-margin-bottom-tablet: 16px;

/* Mobile */
--spacing-padding-top-mobile: 24px;
--spacing-padding-bottom-mobile: 24px;
--spacing-margin-top-mobile: 0px;
--spacing-margin-bottom-mobile: 12px;
```

## 🚀 Полный пример

См. компонент `SpacedContentBlock.vue` в директории `examples/vue3/src/components/` для полного рабочего примера.

## 📚 API

### Props компонента SpacingControl

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | String | 'Отступы' | Заголовок компонента |
| `fieldName` | String | required | Имя поля (для уникальности CSS переменных) |
| `modelValue` | Object | `{}` | Значение spacing данных |
| `spacingTypes` | Array | ALL | Доступные типы отступов |
| `min` | Number | `0` | Минимальное значение |
| `max` | Number | `200` | Максимальное значение |
| `step` | Number | `1` | Шаг изменения |
| `breakpoints` | Array | `null` | Кастомные брекпоинты |
| `useDefaultBreakpoints` | Boolean | `true` | Использовать базовые брекпоинты |
| `required` | Boolean | `false` | Обязательное поле |
| `showPreview` | Boolean | `true` | Показывать превью CSS |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | Object | Изменение spacing данных |

## 💡 Best Practices

1. **Используйте CSS переменные** - это позволяет легко переопределять отступы и обеспечивает гибкость
2. **Задавайте разумные defaultValue** - пользователи смогут начать с хороших базовых значений
3. **Ограничивайте диапазон** - используйте `min` и `max` для предотвращения экстремальных значений
4. **Используйте step** - шаг в 4-8px обеспечивает консистентность в дизайне
5. **Fallback значения** - всегда указывайте fallback в CSS `var(--spacing-padding-top, 0)`

## 🔌 Использование в других фреймворках

### Pure JavaScript
```javascript
import { SpacingControlRenderer } from '@naberika/block-builder';

const control = new SpacingControlRenderer({
  fieldName: 'spacing',
  label: 'Отступы блока',
  config: { min: 0, max: 200, step: 4 },
  onChange: (value) => console.log(value)
});

control.render(document.getElementById('container'));
```

**Пример**: `examples/pure-js-vite/spacing-demo.html`

### React (будущая реализация)
```jsx
import { SpacingControl } from '@naberika/block-builder/react';

<SpacingControl
  label="Отступы"
  fieldName="spacing"
  value={spacing}
  onChange={setSpacing}
/>
```

## 📁 Файлы компонента

- `src/ui/components/SpacingControl.vue` - Vue3 компонент
- `src/ui/services/SpacingControlRenderer.ts` - Pure JS класс
- `src/ui/styles/components/_spacing-control.scss` - Универсальные стили (БЭМ)
- `src/utils/spacingHelpers.ts` - Утилиты для работы со spacing
- `src/core/types/form.ts` - Типы и интерфейсы

