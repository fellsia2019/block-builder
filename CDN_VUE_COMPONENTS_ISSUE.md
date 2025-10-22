# ❌ Проблема с Vue компонентами Swiper через CDN

## 🐛 Проблемы

При попытке использования Vue компонентов Swiper (`<Swiper>`, `<SwiperSlide>`) через CDN возникло несколько критических проблем:

### 1. **Конфликт двух версий Vue**

- `vue.global.js` - загружается через `<script>` тег (UMD/IIFE)
- `vue.esm-browser.js` - из Import Map для swiper-vue (ESM)

Это создаёт **два разных экземпляра Vue**, из-за чего:

```
[Vue warn]: onMounted is called when there is no active component instance
[Vue warn]: provide() can only be used inside setup()
[Vue warn]: Missing ref owner context
```

### 2. **Props приходят как строки**

Из HTML формы checkbox и number приходят как строки:
```javascript
autoplay="on"       // вместо true
loop="on"           // вместо true
autoplayDelay="3000" // вместо 3000
spaceBetween="30"    // вместо 30
```

Vue warnings:
```
Invalid prop: type check failed for prop "autoplay". 
Expected Boolean, got String with value "on".
```

### 3. **Lifecycle хуки не работают**

Swiper Vue компоненты используют Composition API:
- `onMounted`
- `onBeforeUpdate`
- `onUpdated`
- `onBeforeUnmount`
- `provide/inject`

Но из-за разных экземпляров Vue эти хуки регистрируются в "неправильном" Vue и не работают.

---

## ✅ Решение: Возврат к императивному подходу

Вернулись к использованию `new Swiper()` вместо Vue компонентов.

### Почему это лучше для CDN:

1. **Один экземпляр Vue** - используется только `vue.global.js`
2. **Надежность** - Swiper как библиотека, а не как Vue компонент
3. **Работает везде** - не зависит от версии Vue
4. **Проще** - нет Import Maps, нет ESM модулей

### Код:

```javascript
mounted() {
  this.loadSwiper();
},
beforeUnmount() {
  if (this.swiper) {
    this.swiper.destroy(true, true);
  }
},
methods: {
  loadSwiper() {
    if (typeof window.Swiper !== 'undefined') {
      this.initSwiper();
      return;
    }

    // Загружаем swiper-bundle через CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    script.onload = () => {
      this.initSwiper();
    };
    document.head.appendChild(script);
  },
  initSwiper() {
    const container = this.$el.querySelector('.swiper');
    this.swiper = new window.Swiper(container, {
      slidesPerView: 1,
      spaceBetween: this.spaceBetweenValue,
      loop: this.loopValue,
      autoplay: this.autoplayValue ? {
        delay: this.autoplayDelayValue,
        disableOnInteraction: false,
      } : false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }
}
```

### Props преобразование:

```javascript
props: {
  autoplay: { type: [Boolean, String], default: true },
  autoplayDelay: { type: [Number, String], default: 3000 },
  loop: { type: [Boolean, String], default: true },
  spaceBetween: { type: [Number, String], default: 30 }
},
computed: {
  autoplayValue() {
    if (typeof this.autoplay === 'string') {
      return this.autoplay === 'on' || this.autoplay === 'true';
    }
    return this.autoplay;
  },
  autoplayDelayValue() {
    return typeof this.autoplayDelay === 'string' 
      ? parseInt(this.autoplayDelay, 10) 
      : this.autoplayDelay;
  },
  // ... аналогично для loop и spaceBetween
}
```

---

## 🎓 Выводы

### ❌ Vue компоненты Swiper через CDN - НЕ рекомендуется:

1. Требуют одного экземпляра Vue (ESM)
2. Конфликтуют с vue.global.js
3. Требуют Import Maps
4. Сложная настройка
5. Много предупреждений в консоли

### ✅ Императивный Swiper через CDN - РЕКОМЕНДУЕТСЯ:

1. Работает с любой версией Vue
2. Один скрипт - `swiper-bundle.min.js`
3. Нет Import Maps
4. Простая настройка
5. Чистая консоль
6. Полный контроль над lifecycle

---

## 📚 Когда использовать Vue компоненты Swiper?

Vue компоненты Swiper (`<Swiper>`, `<SwiperSlide>`) **рекомендуются** ТОЛЬКО если:

1. **Используете bundler** (Vite, Webpack, Rollup):
   ```javascript
   import { Swiper, SwiperSlide } from 'swiper/vue';
   import { Navigation, Pagination } from 'swiper/modules';
   ```

2. **Один экземпляр Vue** в проекте

3. **ESM модули** из npm/yarn

**НЕ используйте** Vue компоненты Swiper через CDN!

---

## ✅ Текущее решение

Файл: `src/examples/vue3/components/GallerySliderBlock.js`

- Использует `new Swiper()`
- Props преобразуются из строк в правильные типы
- Lifecycle управляется через Vue хуки (`mounted`, `beforeUnmount`)
- Swiper загружается динамически через CDN
- Нет Import Map
- Нет конфликтов Vue
- Работает надежно

**Проект собран ✅**  
**Ошибки исправлены ✅**

