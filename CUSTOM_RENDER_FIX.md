# Исправление поддержки Custom Render (Swiper Slider)

## Проблема
В примере `examples/pure-js-vite` слайдер галереи не работал - вместо Swiper слайдера выводился `<pre>` элемент с JSON данными блока.

## Причина
Отсутствовала поддержка `custom` типа рендера с императивной функцией `mount` в системе BlockBuilder.

## Архитектурное решение

### 1. Типы (`src/core/types/common.ts`)
Добавлен новый вариант в `TRenderRef`:
```typescript
{
  kind: 'custom';
  mount: (container: HTMLElement, props: Record<string, any>) => void;
  unmount?: (container: HTMLElement) => void;
}
```

Также обновлен тип HTML template для поддержки функций:
```typescript
{
  kind: 'html';
  template: string | ((props: Record<string, any>) => string);
}
```

### 2. Утилиты рендеринга (`src/utils/renderHelpers.ts`)
Добавлены новые функции:
- `isCustomRender()` - проверка на custom render
- `getCustomMount()` - получение функции mount
- `getCustomUnmount()` - получение функции unmount

### 3. UI Renderer (`src/ui/services/UIRenderer.ts`)
Ключевые изменения:
- Обработка `kind: 'custom'` в `renderBlockContent()`
- Метод `renderCustomBlock()` для создания контейнера
- Метод `initializeCustomBlocks()` для вызова mount функций после рендеринга
- Исправлена обработка HTML templates (поддержка и строк, и функций)

### 4. UI Controller (`src/ui/controllers/BlockUIController.ts`)
- Передача `render` из конфигурации блока при создании

### 5. Vue компонент (`src/ui/components/BlockComponent.vue`)
- Удален debug вывод
- Добавлена поддержка template-функций

### 6. Demo Builder (`src/ui/demo/BlockBuilderDemo.js`)
- Полная поддержка custom render
- Инициализация custom блоков после рендеринга

## Использование

### Для пользователей пакета (Pure JS)
```javascript
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const blockConfig = {
  gallerySlider: {
    title: 'Слайдер галереи',
    render: {
      kind: 'custom',
      mount: (container, props) => {
        // Создаем HTML
        container.innerHTML = `<div class="swiper">...</div>`;
        
        // Инициализируем Swiper
        const swiperEl = container.querySelector('.swiper');
        new Swiper(swiperEl, {
          modules: [Navigation, Pagination, Autoplay],
          // ... настройки
        });
      },
      unmount: (container) => {
        // Опционально: очистка ресурсов
      }
    },
    fields: [/* конфигурация полей формы */]
  }
};
```

### Для Vue приложений
Vue компоненты работают как прежде через `kind: 'component'`.

### Для HTML шаблонов
Поддерживаются как строки, так и функции:
```javascript
{
  kind: 'html',
  template: (props) => `<div>${props.content}</div>`
}
// или
{
  kind: 'html',
  template: '<div>Static HTML</div>'
}
```

## Тестирование

1. Соберите основной пакет: `npm run build`
2. Перейдите в пример: `cd examples/pure-js-vite`
3. Установите зависимости: `npm install`
4. Запустите: `npm run dev`
5. Добавьте "Слайдер галереи" и проверьте его работу

## Совместимость

- ✅ Обратная совместимость сохранена
- ✅ Работает с Pure JS (Vite, Webpack)
- ✅ Работает с Vue3
- ✅ Работает с CDN версией (через DemoBlockBuilder)

## Файлы, затронутые изменениями

1. `src/core/types/common.ts` - добавлен тип custom render
2. `src/utils/renderHelpers.ts` - утилиты для custom render
3. `src/ui/services/UIRenderer.ts` - рендеринг custom блоков
4. `src/ui/controllers/BlockUIController.ts` - передача render в блоки
5. `src/ui/components/BlockComponent.vue` - поддержка template-функций
6. `src/ui/demo/BlockBuilderDemo.js` - поддержка custom render

## Следование чистой архитектуре

- ✅ **Ядро (Core)**: типы и интерфейсы не зависят от реализации
- ✅ **UI слой**: использует типы из ядра, реализует рендеринг
- ✅ **Инфраструктура**: не затронута
- ✅ **Принцип инверсии зависимостей**: UI зависит от абстракций ядра
- ✅ **Принцип открытости/закрытости**: расширили функционал без изменения существующего кода

## Примечания

Custom render позволяет использовать любые императивные библиотеки (Swiper, Chart.js, Three.js, etc) в BlockBuilder без необходимости создания Vue/React обёрток.

