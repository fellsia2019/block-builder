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
import TextBlock from './components/TextBlock.vue'
import ImageBlock from './components/ImageBlock.vue'
import ButtonBlock from './components/ButtonBlock.vue'
import CardListBlock from './components/CardListBlock.vue'
import HeroBlock from './components/HeroBlock.vue'
```

### 3. Чистая архитектура
Каждый компонент:
- Имеет собственный файл `.vue`
- Содержит template, script и style
- Использует Composition API где необходимо
- Следует принципам Vue3

## Компоненты

### TextBlock.vue
- Отображает текстовый контент
- Поддерживает настройки: размер шрифта, цвет, выравнивание
- Включает hover эффекты

### ImageBlock.vue
- Отображает изображения
- Поддерживает настройки: скругление углов, альтернативный текст
- Обработка ошибок загрузки

### ButtonBlock.vue
- Интерактивная кнопка
- Поддерживает настройки: цвет, размер, отступы
- Состояние загрузки и hover эффекты

### CardListBlock.vue
- Список карточек с информацией
- Адаптивная сетка
- Настраиваемые цвета и отступы

### HeroBlock.vue
- Hero секция с градиентом
- Анимированные декоративные элементы
- Composition API

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