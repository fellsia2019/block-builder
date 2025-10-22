# Обновление изображений на статичные файлы

## Выполнено

Заменены все внешние URL изображений (placeholder.com) на локальные статичные файлы из папки `examples/static`.

## Изменённые файлы

### 1. examples/pure-js-vite/src/block-config.js
✅ Блок изображения: `/static-files/img/1364537351_peyzazhi-na-rabochiy-stol-1.jpeg`
✅ Слайдер галереи:
- Изображение 1: `/static-files/img/1364537351_peyzazhi-na-rabochiy-stol-1.jpeg` - Природа
- Изображение 2: `/static-files/img/Edvard_Grieg.jpg` - Эдвард Григ
- Изображение 3: `/static-files/img/мэдвэд.jpg` - Медведь
- Изображение 4: `/static-files/img/spanch.jpg` - Губка Боб

### 2. examples/vue3/src/block-config.js
✅ Блок изображения: `/static-files/img/1364537351_peyzazhi-na-rabochiy-stol-1.jpeg`
✅ Карточки (card list):
- Карточка 1: `/static-files/img/fwfw.jpg`
- Карточка 2: `/static-files/img/spanch.jpg`
- Карточка 3: `/static-files/img/мэдвэд.jpg`
✅ Слайдер галереи:
- Изображение 1: `/static-files/img/fwfw.jpg`
- Изображение 2: `/static-files/img/spanch.jpg`
- Изображение 3: `/static-files/img/мэдвэд.jpg`
- Изображение 4: `/static-files/img/Квантовое_4D-кодирование_картинка.jpg`

### 3. examples/api-usage/src/main.js
✅ Создана папка `public/static`
✅ Скопированы все изображения из `examples/static`
✅ Блок изображения: `/static/1.jpeg`
✅ Программное создание блоков: циклическое использование `1.jpeg`, `2.jpg`, `3.png`, `qw.jpg`, `bear.jpg`

### 4. examples/pure-js-cdn
✅ Уже использовались локальные изображения - изменений не требуется

## Доступные изображения

В `examples/static`:
- **1.jpeg** - Пейзаж
- **2.jpg** - Изображение 2
- **3.png** - Изображение 3
- **bear.jpg** (мэдвэд.jpg) - Медведь
- **Edvard_Grieg.jpg** - Композитор Эдвард Григ
- **man.png** - Мужчина
- **marie.png** - Женщина
- **max-2.png** - Изображение max
- **qw.jpg** - Природа/пейзаж
- **spanch.jpg** - Губка Боб

## Структура папок

```
examples/
├── static/                           # Общая папка со статичными файлами
│   ├── 1.jpeg
│   ├── 2.jpg
│   ├── bear.jpg
│   └── ...
├── pure-js-vite/
│   └── public/
│       └── static-files/
│           └── img/                  # Копия изображений для vite
│               ├── 1364537351_peyzazhi-na-rabochiy-stol-1.jpeg
│               ├── Edvard_Grieg.jpg
│               ├── мэдвэд.jpg
│               ├── spanch.jpg
│               └── ...
├── vue3/
│   └── public/
│       └── static-files/
│           └── img/                  # Копия изображений для vue3
│               ├── fwfw.jpg
│               ├── spanch.jpg
│               ├── мэдвэд.jpg
│               └── ...
└── api-usage/
    └── public/
        └── static/                   # Копия изображений для api-usage
            ├── 1.jpeg
            ├── 2.jpg
            ├── 3.png
            ├── qw.jpg
            ├── bear.jpg
            └── ...
```

## Преимущества

✅ **Нет зависимости от внешних сервисов** - примеры работают офлайн
✅ **Быстрая загрузка** - локальные файлы загружаются мгновенно
✅ **Осмысленный контент** - реальные изображения вместо placeholder
✅ **Профессиональный вид** - примеры выглядят как настоящие приложения

## Тестирование

### Pure JS Vite
```bash
cd examples/pure-js-vite
npm run dev
# Добавьте "Изображение" или "Слайдер галереи"
# Должны отобразиться локальные изображения
```

### Vue3
```bash
cd examples/vue3
npm run dev
# Добавьте "Изображение", "Список карточек" или "Слайдер галереи"
# Должны отобразиться локальные изображения
```

### API Usage
```bash
cd examples/api-usage
npm run dev
# Нажмите "Создать блок с изображением"
# При каждом нажатии будет использоваться новое изображение из массива
```

## Примечания

- Изображения в `public/` доступны напрямую через корневой путь (например, `/static/1.jpeg`)
- Кириллица в именах файлов поддерживается (`мэдвэд.jpg`, `Квантовое_4D-кодирование_картинка.jpg`)
- При необходимости можно добавить больше изображений в папку `examples/static`
- Все изменения обратно совместимы - можно по-прежнему использовать внешние URL при необходимости

