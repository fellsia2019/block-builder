# Реализация блока с Swiper слайдером

## Описание

Добавлен новый блок **Галерея со слайдером** (`gallerySlider`) для демонстрации работы пакета BlockBuilder со сложными компонентами и сторонними библиотеками.

Блок использует популярную библиотеку **Swiper.js** для создания интерактивного слайдера изображений с:
- Навигацией (кнопки вперёд/назад)
- Пагинацией (точки/bullets)
- Автоматической прокруткой
- Бесконечной прокруткой (loop)
- Настраиваемыми отступами между слайдами

---

## Архитектурные принципы

### ✅ Соблюдение чистой архитектуры

1. **Пакет остаётся универсальным**:
   - BlockBuilder **НЕ** содержит логики Swiper
   - BlockBuilder **НЕ** зависит от Swiper
   - Пакет только рендерит HTML и монтирует Vue компоненты

2. **Вся логика в коде пользователя**:
   - **Vue3**: Компонент `GallerySliderBlock.js` сам загружает и инициализирует Swiper
   - **Pure JS**: HTML файл содержит скрипт инициализации Swiper через MutationObserver

3. **Инверсия зависимостей**:
   - Пакет предоставляет механизм для рендеринга пользовательских блоков
   - Пользователь решает, какие библиотеки использовать
   - Зависимости управляются на стороне пользователя

---

## Реализация для Vue3

### Файлы

#### `src/examples/vue3/components/GallerySliderBlock.js`
**Пользовательский компонент**, который:

1. **Загружает Swiper динамически**:
```javascript
loadSwiper() {
  // Проверяем, загружен ли Swiper
  if (typeof window.Swiper !== 'undefined') {
    this.initSwiper();
    return;
  }

  // Загружаем CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
  document.head.appendChild(link);

  // Загружаем JS
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
  script.onload = () => {
    this.initSwiper();
  };
  document.head.appendChild(script);
}
```

2. **Инициализирует Swiper с настройками**:
```javascript
initSwiper() {
  this.$nextTick(() => {
    const container = this.$el.querySelector('.swiper');
    if (container && window.Swiper) {
      this.swiper = new window.Swiper(container, {
        slidesPerView: 1,
        spaceBetween: this.spaceBetween,
        loop: this.loop,
        autoplay: this.autoplay ? {
          delay: this.autoplayDelay,
          disableOnInteraction: false,
        } : false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });
    }
  });
}
```

3. **Уничтожает Swiper при размонтировании**:
```javascript
beforeUnmount() {
  if (this.swiper) {
    this.swiper.destroy(true, true);
  }
}
```

#### `src/examples/vue3/block-config.js`
Добавлен новый блок:
```javascript
gallerySlider: {
  title: 'Галерея со слайдером',
  description: 'Слайдер изображений с использованием Swiper.js',
  render: {
    kind: 'component',
    framework: 'vue',
    component: GallerySliderBlock  // Пользовательский компонент
  },
  fields: [
    // 4 изображения с URL, заголовком и описанием
    // Настройки: autoplay, autoplayDelay, loop, spaceBetween
  ]
}
```

---

## Реализация для Pure JS

### Файлы

#### `src/examples/pure-js/block-config.js`
Блок с template функцией:

```javascript
gallerySlider: {
  title: 'Галерея со слайдером',
  description: 'Слайдер изображений с использованием Swiper.js',
  template: (props) => {
    // Парсим настройки
    const autoplay = props.autoplay !== 'false' && props.autoplay !== false;
    const autoplayDelay = parseInt(props.autoplayDelay || '3000', 10);
    const loop = props.loop !== 'false' && props.loop !== false;
    const spaceBetween = parseInt(props.spaceBetween || '30', 10);
    
    // Генерируем уникальный ID
    const swiperId = `swiper-${Math.random().toString(36).substr(2, 9)}`;
    
    // Сохраняем конфигурацию в data-атрибуте
    const swiperData = JSON.stringify({ 
      autoplay, autoplayDelay, loop, spaceBetween 
    }).replace(/"/g, '&quot;');
    
    // Возвращаем HTML с data-атрибутом для инициализации
    return `
      <div class="swiper" data-swiper-config='${swiperData}'>
        <div class="swiper-wrapper">
          <!-- слайды -->
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    `;
  }
}
```

#### `src/examples/pure-js/index.html`
**Пользовательский код** для инициализации Swiper:

1. **Подключение библиотеки через CDN**:
```html
<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

2. **Инициализация через MutationObserver**:
```javascript
// Функция инициализации одного слайдера
const initSwiper = function(swiperElement) {
  if (swiperElement.swiper) return; // Уже инициализирован
  
  // Получаем конфигурацию из data-атрибута
  const configAttr = swiperElement.getAttribute('data-swiper-config');
  let config = {};
  if (configAttr) {
    config = JSON.parse(configAttr);
  }
  
  // Создаём Swiper
  new Swiper(swiperElement, {
    slidesPerView: 1,
    spaceBetween: config.spaceBetween || 30,
    loop: config.loop !== undefined ? config.loop : true,
    autoplay: config.autoplay ? {
      delay: config.autoplayDelay || 3000,
      disableOnInteraction: false,
    } : false,
    pagination: {
      el: swiperElement.querySelector('.swiper-pagination'),
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: swiperElement.querySelector('.swiper-button-next'),
      prevEl: swiperElement.querySelector('.swiper-button-prev'),
    }
  });
};

// MutationObserver для динамически добавляемых слайдеров
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.nodeType === 1) {
        if (node.classList && node.classList.contains('swiper')) {
          initSwiper(node);
        }
        if (node.querySelectorAll) {
          node.querySelectorAll('.swiper').forEach(initSwiper);
        }
      }
    });
  });
});

// Запускаем наблюдение
observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

---

## Особенности реализации

### 1. **Динамическая инициализация**

**Проблема**: BlockBuilder создаёт блоки динамически, после загрузки страницы.

**Решение**:
- **Vue3**: Инициализация в хуке `mounted()`
- **Pure JS**: MutationObserver отслеживает добавление новых `.swiper` элементов в DOM

### 2. **Передача настроек**

**Проблема**: Как передать настройки из формы редактирования в Swiper?

**Решение**:
- **Vue3**: Через `props` компонента
- **Pure JS**: Через `data-swiper-config` атрибут с JSON

### 3. **Уникальные ID**

**Проблема**: На странице может быть несколько слайдеров.

**Решение**: Генерация уникального ID для каждого слайдера:
```javascript
const swiperId = `swiper-${Math.random().toString(36).substr(2, 9)}`;
```

### 4. **Очистка ресурсов**

**Проблема**: Утечки памяти при удалении блоков.

**Решение**:
- **Vue3**: Метод `beforeUnmount()` вызывает `swiper.destroy()`
- **Pure JS**: Swiper автоматически очищается при удалении из DOM

---

## Поля формы

Блок имеет следующие настраиваемые поля:

### Контент
- `title` - Заголовок галереи
- `image1_url`, `image1_title`, `image1_description` - Изображение 1
- `image2_url`, `image2_title`, `image2_description` - Изображение 2
- `image3_url`, `image3_title`, `image3_description` - Изображение 3
- `image4_url`, `image4_title`, `image4_description` - Изображение 4

### Настройки поведения
- `autoplay` (checkbox) - Автоматическая прокрутка (по умолчанию: `true`)
- `autoplayDelay` (number) - Задержка автопрокрутки в мс (по умолчанию: `3000`, мин: `1000`, макс: `10000`)
- `loop` (checkbox) - Бесконечная прокрутка (по умолчанию: `true`)
- `spaceBetween` (number) - Отступ между слайдами в px (по умолчанию: `30`, мин: `0`, макс: `100`)

---

## Преимущества подхода

### ✅ Масштабируемость
- Легко добавить другие библиотеки (AOS, GSAP, Chart.js и т.д.)
- Пакет остаётся лёгким и не зависит от сторонних библиотек

### ✅ Гибкость
- Пользователь полностью контролирует версию и настройки Swiper
- Можно использовать CDN, npm, или bundled версии

### ✅ Производительность
- Swiper загружается только когда нужен (lazy loading в Vue3)
- Нет лишних зависимостей в бандле пакета

### ✅ Чистая архитектура
- **Core** (ядро пакета) не зависит от инфраструктуры (Swiper)
- **Инверсия зависимостей**: пакет зависит от абстракций (интерфейсов), а не от конкретных реализаций
- **Разделение ответственности**: пакет управляет блоками, пользователь управляет UI-логикой

---

## Тестирование

### Как проверить Vue3 пример:
1. Запустить dev-сервер: `npm run dev` или `node dev-server.js`
2. Открыть: `http://localhost:3000/examples/vue3/`
3. Добавить блок "Галерея со слайдером"
4. Настроить изображения и параметры
5. Проверить:
   - Слайдер прокручивается
   - Кнопки навигации работают
   - Пагинация работает
   - Автопрокрутка работает (если включена)
   - Loop работает (если включён)

### Как проверить Pure JS пример:
1. Запустить dev-сервер: `npm run dev` или `node dev-server.js`
2. Открыть: `http://localhost:3000/examples/pure-js/`
3. Добавить блок "Галерея со слайдером"
4. Выполнить те же проверки, что и для Vue3

---

## Выводы

Реализация блока со Swiper слайдером демонстрирует:

1. **Работу с внешними библиотеками** без нарушения принципов чистой архитектуры
2. **Универсальность пакета** - он может рендерить любые компоненты, не зная о их внутренней логике
3. **Правильное разделение ответственности** - пакет управляет блоками, пользователь управляет UI
4. **Масштабируемость** - легко добавлять новые сложные компоненты

Этот подход можно использовать для интеграции любых других библиотек:
- Chart.js для графиков
- FullCalendar для календарей
- AOS для анимаций
- И т.д.

**Главный принцип**: пакет предоставляет инфраструктуру, пользователь реализует логику.

