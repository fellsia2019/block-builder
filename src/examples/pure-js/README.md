# Pure JS Example

Пример использования BlockBuilder с чистым JavaScript (без фреймворков).

## Особенности

- Использование template функций для генерации HTML
- Работа с vanilla JavaScript
- Динамическая инициализация сложных компонентов
- Интеграция сторонних библиотек (Swiper)

## Блоки

- **text** - текстовый блок
- **image** - блок с изображением
- **button** - кнопка с переходом
- **cardlist** - список карточек с модальными окнами деталей
- **hero** - главный блок-герой с фоном
- **gallerySlider** - галерея изображений со Swiper слайдером (сложный компонент) ⭐

## Структура проекта

```
pure-js/
├── block-config.js      # Конфигурация блоков с template функциями
├── index.html          # HTML файл с инициализацией и пользовательской логикой
└── README.md           # Этот файл
```

## Сложные компоненты

### GallerySlider - Пример интеграции с Swiper.js

Демонстрирует:
- ✅ Подключение внешних библиотек через CDN
- ✅ Инициализацию Swiper через MutationObserver
- ✅ Передачу настроек через data-атрибуты
- ✅ Работу с динамически добавляемыми элементами
- ✅ Работу со сложными компонентами без нарушения чистой архитектуры

#### Как работает:

1. **Template функция генерирует HTML**:
```javascript
template: (props) => {
  const swiperData = JSON.stringify({ 
    autoplay, autoplayDelay, loop, spaceBetween 
  }).replace(/"/g, '&quot;');
  
  return `
    <div class="swiper" data-swiper-config='${swiperData}'>
      <!-- слайды -->
    </div>
  `;
}
```

2. **HTML загружает Swiper**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

3. **MutationObserver инициализирует слайдеры**:
```javascript
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.classList && node.classList.contains('swiper')) {
        initSwiper(node); // Инициализируем новый слайдер
      }
    });
  });
});
```

**Важно**: Пакет BlockBuilder НЕ знает о Swiper - вся логика в пользовательском коде!

## Модальные окна

### CardList - Модалка с деталями карточки

Блок `cardlist` демонстрирует:
- Передачу данных через `data-cards` атрибут
- Обработку кликов на динамически созданных элементах
- Открытие модального окна с деталями карточки
- Закрытие по клику на overlay или ESC

Вся логика модалки находится в `index.html` (код пользователя), а НЕ в пакете!

## Использование

1. Откройте `index.html` в браузере через dev-сервер
2. Пакет BlockBuilder автоматически инициализируется
3. Добавьте блоки через UI
4. Пользовательская логика (модалки, Swiper) работает автоматически

## Преимущества подхода

- ✅ Работает без фреймворков
- ✅ Легковесный и быстрый
- ✅ Чистая архитектура - пакет не зависит от пользовательской логики
- ✅ Интеграция сложных библиотек через CDN
- ✅ MutationObserver для динамической инициализации
- ✅ Пакет остаётся универсальным

## Интеграция сторонних библиотек

Подход с `data-атрибутами` + `MutationObserver` позволяет интегрировать любые библиотеки:

- **Swiper** - слайдеры
- **Chart.js** - графики
- **FullCalendar** - календари
- **AOS** - анимации при скролле
- И т.д.

Главное:
1. Подключить библиотеку в HTML
2. Создать template с нужной разметкой и `data-атрибутами`
3. Написать логику инициализации с MutationObserver

Пакет остаётся чистым и универсальным!

