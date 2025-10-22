# Vue3 Пример с реальными компонентами

Этот пример демонстрирует правильное использование пакета Naberika с реальными Vue3 компонентами.

## Структура проекта

```
vue3/
├── components/           # Реальные Vue компоненты
│   ├── TextBlock.vue
│   ├── ImageBlock.vue
│   ├── ButtonBlock.vue
│   ├── CardListBlock.vue
│   └── HeroBlock.vue
├── block-config.js      # Конфигурация с реальными компонентами
├── index.html          # HTML файл с инициализацией
└── README.md           # Этот файл
```

## Ключевые изменения

### 1. Реальные Vue компоненты
Вместо объектов-заглушек теперь используются настоящие Vue компоненты:

```javascript
// ❌ Старый способ (объекты-заглушки)
component: {
  name: 'TextBlock',
  template: `<div>{{ content }}</div>`,
  props: { content: String }
}

// ✅ Новый способ (реальные компоненты)
import TextBlock from './components/TextBlock.vue'
component: TextBlock
```

### 2. Импорт компонентов
В `block-config.js` добавлены импорты реальных компонентов:

```javascript
import TextBlock from './components/TextBlock.js'
import ImageBlock from './components/ImageBlock.js'
import ButtonBlock from './components/ButtonBlock.js'
import CardListBlock from './components/CardListBlock.js'
import HeroBlock from './components/HeroBlock.js'
import GallerySliderBlock from './components/GallerySliderBlock.js'
```

### 3. Чистая архитектура
Каждый компонент:
- Имеет собственный файл `.vue`
- Содержит template, script и style
- Использует Composition API где необходимо
- Следует принципам Vue3

## Компоненты

### TextBlock.js
- Отображает текстовый контент
- Поддерживает настройки: размер шрифта, цвет, выравнивание
- Включает hover эффекты

### ImageBlock.js
- Отображает изображения
- Поддерживает настройки: скругление углов, альтернативный текст
- Обработка ошибок загрузки

### ButtonBlock.js
- Интерактивная кнопка
- Поддерживает настройки: цвет, размер, отступы
- Состояние загрузки и hover эффекты

### CardListBlock.js
- Список карточек с информацией
- Адаптивная сетка
- Настраиваемые цвета и отступы

### HeroBlock.js
- Hero секция с градиентом
- Анимированные декоративные элементы
- Composition API

### GallerySliderBlock.js ⭐ СЛОЖНЫЙ КОМПОНЕНТ
- Галерея изображений со Swiper слайдером
- Динамическая загрузка внешней библиотеки (Swiper.js)
- Навигация, пагинация, автопрокрутка
- Инициализация в lifecycle хуках
- Правильная очистка ресурсов при размонтировании
- **Демонстрирует работу со сторонними библиотеками БЕЗ нарушения чистой архитектуры**

## Использование

1. Откройте `index.html` в браузере
2. Пакет Naberika автоматически инициализируется с вашими компонентами
3. Все UI контролы и формы рендерятся автоматически

## Преимущества

- ✅ Реальные Vue компоненты вместо заглушек
- ✅ Полная поддержка Vue3 функциональности
- ✅ Чистая архитектура и разделение ответственности
- ✅ Легкость тестирования и отладки
- ✅ Возможность использования TypeScript
- ✅ Поддержка всех Vue3 возможностей (Composition API, Teleport, Suspense и т.д.)
- ✅ Интеграция сторонних библиотек (Swiper) без зависимостей в пакете
- ✅ Пакет остаётся универсальным и не знает о пользовательских компонентах

## Интеграция сторонних библиотек

### GallerySliderBlock + Swiper.js

Этот блок демонстрирует **правильный подход** к интеграции сложных библиотек:

1. **Пакет НЕ зависит от Swiper** - библиотека загружается в пользовательском компоненте
2. **Динамическая загрузка** - Swiper CSS и JS подгружаются только когда нужны
3. **Lifecycle управление** - инициализация в `mounted()`, очистка в `beforeUnmount()`
4. **Настройки через props** - autoplay, loop, spaceBetween передаются из формы

```javascript
// В компоненте GallerySliderBlock
mounted() {
  this.loadSwiper(); // Загружаем Swiper динамически
},
beforeUnmount() {
  if (this.swiper) {
    this.swiper.destroy(true, true); // Очищаем ресурсы
  }
}
```

Такой подход позволяет добавлять любые библиотеки (Chart.js, FullCalendar, AOS и т.д.) без изменения кода пакета!