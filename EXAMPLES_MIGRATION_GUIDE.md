# Миграция примеров на полноценные сборки

Документ описывает переход от CDN версий примеров к полноценным приложениям с Vite сборкой.

## 🎯 Проблема

Старые примеры использовали CDN:
- ❌ Vue через глобальный `window.Vue`
- ❌ Swiper через CDN с конфликтами
- ❌ Inline templates вместо SFC
- ❌ Нет современного тулинга
- ❌ Невозможно использовать настоящие npm пакеты

## ✅ Решение

Созданы полноценные приложения с Vite:
- ✅ Vue3 SFC компоненты
- ✅ Настоящий Swiper из npm
- ✅ Современная сборка
- ✅ HMR для разработки
- ✅ Tree-shaking для продакшн

## 📁 Новая структура

```
examples/
├── README.md                    # Общая документация
│
├── vue3/                        # ✅ Vue3 + Vite
│   ├── src/
│   │   ├── components/          # Настоящие .vue файлы
│   │   │   ├── TextBlock.vue
│   │   │   ├── ImageBlock.vue
│   │   │   ├── ButtonBlock.vue
│   │   │   ├── HeroBlock.vue
│   │   │   ├── CardListBlock.vue
│   │   │   └── GallerySliderBlock.vue  # С настоящим Swiper!
│   │   ├── block-config.js      # Импорт .vue компонентов
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── public/
│   │   └── static-files/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── pure-js-vite/                # ✅ Pure JS + Vite
│   ├── src/
│   │   ├── block-config.js      # Настоящий Swiper из npm
│   │   ├── main.js
│   │   └── style.css
│   ├── public/
│   │   └── static-files/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── api-usage/                   # ✅ API Usage
│   ├── src/
│   │   ├── main.js              # Программный API
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── pure-js-cdn/                 # ⚠️ УСТАРЕВШИЙ CDN пример
```

## 🔧 Настройка npm workspaces

### Корневой package.json

```json
{
  "workspaces": [
    "examples/vue3",
    "examples/pure-js-vite",
    "examples/api-usage"
  ],
  "files": [
    "dist"
  ],
  "scripts": {
    "example:vue3": "npm run dev --workspace=examples/vue3-app",
    "example:pure-js": "npm run dev --workspace=examples/pure-js-app",
    "example:api-usage": "npm run dev --workspace=examples/api-usage-app"
  }
}
```

### Пример package.json для Vue3

```json
{
  "name": "block-builder-example-vue3",
  "private": true,
  "dependencies": {
    "block-builder": "file:../..",
    "vue": "^3.5.22",
    "swiper": "^11.1.15"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "vite": "^6.0.5"
  }
}
```

### Vite конфигурация

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'block-builder': path.resolve(__dirname, '../../dist/index.esm.js')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['block-builder']
  }
})
```

## 📦 Защита от публикации в npm

### Способ 1: files в package.json (используется)

```json
{
  "files": [
    "dist"
  ]
}
```

Только `dist/` попадет в npm публикацию.

### Способ 2: .npmignore (дополнительная защита)

```
# Примеры
examples/
src/examples/

# Исходники
src/

# Конфигурация
dev-server.js
rollup.*.cjs
tsconfig.json
```

## 🚀 Использование

### Установка

```bash
# Из корня проекта
npm install
```

Установит зависимости для:
- Основного пакета
- Всех примеров (благодаря workspaces)

### Запуск примеров

```bash
# Vue3 пример
npm run example:vue3      # http://localhost:3000

# Pure JS пример
npm run example:pure-js   # http://localhost:3001

# API Usage пример
npm run example:api-usage # http://localhost:3002
```

### Разработка

```bash
# Терминал 1: сборка пакета
npm run dev:build

# Терминал 2: пример
npm run example:vue3
```

## ✨ Ключевые улучшения

### Vue3 пример

**До (CDN):**
```javascript
const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'GallerySliderBlock',
  template: `<div>...</div>`,
  mounted() {
    // Загрузка Swiper из CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/...';
  }
})
```

**После (Vite):**
```vue
<template>
  <Swiper
    :modules="modules"
    :navigation="true"
    :pagination="{ clickable: true }"
  >
    <SwiperSlide v-for="slide in slides" :key="slide.id">
      <!-- ... -->
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
</script>
```

### Pure JS пример

**До (CDN):**
```javascript
// Проблемы с импортом модулей
window.Swiper // глобальная переменная
```

**После (Vite):**
```javascript
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'

new Swiper('.swiper', {
  modules: [Navigation, Pagination, Autoplay],
  // ...
})
```

## 📊 Сравнение

| Характеристика | CDN версия | Vite версия |
|----------------|------------|-------------|
| Vue компоненты | Inline templates | SFC (.vue) |
| Swiper | CDN (конфликты) | npm (чистая интеграция) |
| Импорты | `<script src="">` | `import from ''` |
| Сборка | Нет | Vite |
| HMR | Нет | Да |
| Tree-shaking | Нет | Да |
| Source maps | Нет | Да |
| Размер бандла | Весь код | Только используемый |
| Скорость загрузки | Медленная | Быстрая |
| Поддержка npm | Ограничено | Полная |

## 🎓 Примеры использования

### Swiper в Vue3 (SFC)

```vue
<template>
  <Swiper
    :modules="modules"
    :slides-per-view="2"
    :space-between="30"
    :navigation="true"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000 }"
  >
    <SwiperSlide v-for="item in items" :key="item.id">
      {{ item.content }}
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination, Autoplay]
const items = [/* ... */]
</script>
```

### Swiper в Pure JS

```javascript
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination, Autoplay],
  slidesPerView: 2,
  spaceBetween: 30,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 3000,
  },
})
```

## ⚠️ Миграционные заметки

### Что делать со старыми примерами?

1. **Оставлен один CDN пример** - `pure-js-cdn/` для быстрых тестов
2. **Помечен как устаревший** - с предупреждениями в README
3. **Остальные удалены** - заменены на полноценные версии с Vite

### Обновление документации

Обновите главный README проекта:

```markdown
## Примеры

### ✅ Рекомендуемые (с Vite сборкой)
- [Vue3 + Vite](./examples/vue3/README.md)
- [Pure JS + Vite](./examples/pure-js-vite/README.md)
- [API Usage](./examples/api-usage/README.md)

### ⚠️ Устаревшие (CDN версия)
- [Pure JS CDN](./examples/pure-js-cdn/README.md) - только для быстрых тестов
```

## 🔍 Проверка что не попадет в npm

```bash
# Создать пробную сборку
npm pack

# Проверить содержимое
tar -tzf block-builder-1.0.0.tgz

# Должно быть только:
# package/
# package/dist/
# package/package.json
# package/README.md
```

## 🎉 Результат

Теперь у вас есть:

1. ✅ **Полноценные примеры** с современными технологиями
2. ✅ **Настоящий Swiper** из npm без конфликтов
3. ✅ **HMR** для быстрой разработки
4. ✅ **Tree-shaking** для оптимизации продакшн
5. ✅ **Защита от публикации** примеров в npm
6. ✅ **npm workspaces** для удобного управления

Примеры показывают **реальное** использование в production приложениях!

