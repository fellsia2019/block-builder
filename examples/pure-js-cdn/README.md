# BlockBuilder - Pure JS CDN Example

Простейший пример использования BlockBuilder без npm и сборки.

## ⚠️ Важно

Это **устаревший** подход с ограничениями. Используйте только для:
- Быстрых прототипов
- Простых тестов функционала
- Проектов где невозможна сборка

**Для production используйте:**
- [Vue3 пример](../vue3/README.md) - если используете Vue3
- [Pure JS Vite пример](../pure-js-vite/README.md) - если нужен чистый JS
- [API Usage пример](../api-usage/README.md) - если нужен кастомный UI

## Запуск

Просто откройте `index.html` в браузере. Никакая сборка не требуется.

```bash
# Или используйте простой HTTP сервер
npx serve .
```

## Ограничения CDN подхода

❌ **Нет современных возможностей:**
- Нет ES Modules
- Нет npm пакетов
- Нет HMR
- Нет Tree-shaking
- Нет TypeScript

❌ **Конфликты версий:**
- Vue через глобальную переменную
- Swiper из CDN с ограничениями
- Проблемы совместимости модулей

❌ **Производительность:**
- Загружается весь код (нет оптимизации)
- Нет минификации
- Нет кэширования модулей

## Когда использовать

✅ **Используйте CDN версию когда:**
- Нужен очень быстрый прототип
- Учебный проект
- Невозможно установить Node.js
- Демонстрация на JSFiddle/CodePen

❌ **НЕ используйте для:**
- Production приложений
- Сложных проектов
- Когда нужна производительность
- Когда нужны npm пакеты

## Альтернативы (рекомендуется)

### Для Vue3 проектов
```bash
cd ../vue3
npm install
npm run dev
```

### Для Vanilla JS проектов
```bash
cd ../pure-js-vite
npm install
npm run dev
```

### Для кастомного UI
```bash
cd ../api-usage
npm install
npm run dev
```

## Структура

```
pure-js-cdn/
├── index.html          # HTML со скриптами из CDN
├── block-config.js     # Конфигурация блоков
└── README.md           # Этот файл
```

## Пример кода

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Vue из CDN -->
    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        // Импорт BlockBuilder
        import { BlockBuilder } from '/dist/index.esm.js';
        
        // Конфигурация
        const blockBuilder = new BlockBuilder({
            containerId: 'app',
            blockConfigs: { /* ... */ }
        });
    </script>
</body>
</html>
```

## Миграция на современный подход

1. **Выберите подход:**
   - Vue3 → используйте `examples/vue3`
   - Vanilla JS → используйте `examples/pure-js-vite`
   
2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Перенесите конфигурацию:**
   - Скопируйте `block-config.js`
   - Адаптируйте под новый формат (если нужно)

4. **Запустите:**
   ```bash
   npm run dev
   ```

## Дополнительная информация

- [Общая документация примеров](../README.md)
- [Руководство по миграции](../../EXAMPLES_MIGRATION_GUIDE.md)
- [Быстрый старт](../../EXAMPLES_QUICKSTART.md)

---

**Рекомендация:** Перейдите на современные примеры с Vite для лучшего developer experience и производительности!
