/**
 * Конфигурация блоков для пользователя
 * Это пример ПРАВИЛЬНОГО использования BlockBuilder с полноценным Vue3 + Vite
 * 
 * ✅ Настоящие Vue SFC компоненты (.vue файлы)
 * ✅ Настоящий Swiper из npm пакета
 * ✅ Полноценная сборка с Vite
 * ✅ Все возможности современного фреймворка
 */

import { defineAsyncComponent } from 'vue'

// Импорт настоящих Vue SFC компонентов
import TextBlock from './components/TextBlock.vue'
import ImageBlock from './components/ImageBlock.vue'
import ButtonBlock from './components/ButtonBlock.vue'
import CardListBlock from './components/CardListBlock.vue'
import HeroBlock from './components/HeroBlock.vue'
import FeatureCard from './components/FeatureCard.vue'
import GallerySliderBlock from './components/GallerySliderBlock.vue'
import SpacedContentBlock from './components/SpacedContentBlock.vue'

// ✅ АСИНХРОННЫЙ импорт компонента (загружается по требованию)
const Counter = defineAsyncComponent(() => import('./components/Counter.vue'))


export const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    icon: '📝',
    description: 'Добавьте текстовый контент на страницу',
    render: {
      kind: 'component',
      framework: 'vue',
      component: TextBlock
    },
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        placeholder: 'Введите ваш текст...',
        rules: [
          { type: 'required', message: 'Текст обязателен' },
          { type: 'minLength', value: 1, message: 'Текст не может быть пустым' }
        ],
        defaultValue: ''
      },
      {
        field: 'fontSize',
        label: 'Размер шрифта',
        type: 'number',
        rules: [
          { type: 'required', message: 'Размер шрифта обязателен' },
          { type: 'min', value: 8, message: 'Минимальный размер: 8px' },
          { type: 'max', value: 72, message: 'Максимальный размер: 72px' }
        ],
        defaultValue: 16
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет обязателен' }],
        defaultValue: '#333333'
      },
      {
        field: 'textAlign',
        label: 'Выравнивание',
        type: 'select',
        options: [
          { value: 'left', label: 'По левому краю' },
          { value: 'center', label: 'По центру' },
          { value: 'right', label: 'По правому краю' }
        ],
        rules: [{ type: 'required', message: 'Выравнивание обязательно' }],
        defaultValue: 'left'
      }
    ],
    // 🧪 Кастомные брекпоинты для тестирования
    spacingOptions: {
      config: {
        min: 0,
        max: 120,
        step: 8,
        // Кастомные брекпоинты (когда указаны, заменяют дефолтные)
        breakpoints: [
          { name: 'xlarge', label: 'XL (Desktop)', maxWidth: undefined }, // Desktop без ограничения
          { name: 'large', label: 'L (Laptop)', maxWidth: 1440 },
          { name: 'medium', label: 'M (Tablet)', maxWidth: 1024 },
          { name: 'small', label: 'S (Mobile)', maxWidth: 640 }
        ]
      }
    }
  },

  image: {
    title: 'Изображение',
    icon: '🖼️',
    description: 'Добавьте изображение на страницу',
    render: {
      kind: 'component',
      framework: 'vue',
      component: ImageBlock
    },
    fields: [
      {
        field: 'src',
        label: 'URL изображения',
        type: 'text',
        placeholder: 'https://example.com/image.jpg',
        rules: [
          { type: 'required', message: 'URL обязателен' },
          { type: 'url', message: 'Введите корректный URL' }
        ],
        defaultValue: '/1.jpeg'
      },
      {
        field: 'alt',
        label: 'Описание',
        type: 'text',
        placeholder: 'Описание изображения',
        rules: [],
        defaultValue: 'Изображение'
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 8
      }
    ]
  },

  button: {
    title: 'Кнопка',
    icon: '🔘',
    description: 'Добавьте интерактивную кнопку',
    render: {
      kind: 'component',
      framework: 'vue',
      component: ButtonBlock
    },
    fields: [
      {
        field: 'text',
        label: 'Текст кнопки',
        type: 'text',
        placeholder: 'Нажми меня',
        rules: [
          { type: 'required', message: 'Текст кнопки обязателен' },
          { type: 'minLength', value: 1, message: 'Текст не может быть пустым' }
        ],
        defaultValue: 'Нажми меня'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет обязателен' }],
        defaultValue: '#007bff'
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет текста обязателен' }],
        defaultValue: '#ffffff'
      },
      {
        field: 'borderRadius',
        label: 'Скругление',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 4
      },
      {
        field: 'padding',
        label: 'Отступы',
        type: 'text',
        placeholder: '8px 16px',
        rules: [{ type: 'required', message: 'Отступы обязательны' }],
        defaultValue: '8px 16px'
      }
    ]
  },

  hero: {
    title: 'Hero секция',
    icon: '🎯',
    description: 'Главная секция с заголовком и призывом к действию',
    render: {
      kind: 'component',
      framework: 'vue',
      component: HeroBlock
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок',
        type: 'text',
        placeholder: 'Добро пожаловать',
        rules: [{ type: 'required', message: 'Заголовок обязателен' }],
        defaultValue: 'Добро пожаловать'
      },
      {
        field: 'subtitle',
        label: 'Подзаголовок',
        type: 'textarea',
        placeholder: 'Создайте что-то удивительное',
        rules: [],
        defaultValue: 'Создайте что-то удивительное'
      },
      {
        field: 'backgroundColor',
        label: 'Основной цвет фона',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет обязателен' }],
        defaultValue: '#667eea'
      },
      {
        field: 'accentColor',
        label: 'Акцентный цвет',
        type: 'color',
        rules: [{ type: 'required', message: 'Акцентный цвет обязателен' }],
        defaultValue: '#764ba2'
      },
      {
        field: 'textColor',
        label: 'Цвет текста',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет текста обязателен' }],
        defaultValue: '#ffffff'
      },
      {
        field: 'titleSize',
        label: 'Размер заголовка',
        type: 'number',
        rules: [
          { type: 'min', value: 20, message: 'Минимум: 20px' },
          { type: 'max', value: 100, message: 'Максимум: 100px' }
        ],
        defaultValue: 48
      },
      {
        field: 'subtitleSize',
        label: 'Размер подзаголовка',
        type: 'number',
        rules: [
          { type: 'min', value: 12, message: 'Минимум: 12px' },
          { type: 'max', value: 40, message: 'Максимум: 40px' }
        ],
        defaultValue: 20
      },
      {
        field: 'showButton',
        label: 'Показать кнопку',
        type: 'checkbox',
        rules: [],
        defaultValue: true
      },
      {
        field: 'buttonText',
        label: 'Текст кнопки',
        type: 'text',
        placeholder: 'Начать',
        rules: [],
        defaultValue: 'Начать'
      },
      {
        field: 'buttonColor',
        label: 'Цвет кнопки',
        type: 'color',
        rules: [],
        defaultValue: '#ffffff'
      },
      {
        field: 'buttonTextColor',
        label: 'Цвет текста кнопки',
        type: 'color',
        rules: [],
        defaultValue: '#333333'
      },
      {
        field: 'showDecorations',
        label: 'Показать декорации',
        type: 'checkbox',
        rules: [],
        defaultValue: true
      }
    ],
    // Пример использования padding для блока с фоном
    spacingOptions: {
      spacingTypes: ['padding-top', 'padding-bottom', 'margin-bottom'],
      config: {
        min: 0,
        max: 200,
        step: 10
      }
    }
  },

  cardList: {
    title: 'Список карточек',
    icon: '🃏',
    description: 'Сетка из карточек с изображениями и описаниями',
    render: {
      kind: 'component',
      framework: 'vue',
      component: CardListBlock
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок секции',
        type: 'text',
        placeholder: 'Наши услуги',
        rules: [],
        defaultValue: 'Наши услуги'
      },
      // Карточка 1
      {
        field: 'card1_title',
        label: 'Карточка 1 - Заголовок',
        type: 'text',
        rules: [{ type: 'required', message: 'Заголовок обязателен' }],
        defaultValue: 'Веб-разработка'
      },
      {
        field: 'card1_text',
        label: 'Карточка 1 - Текст',
        type: 'textarea',
        rules: [{ type: 'required', message: 'Текст обязателен' }],
        defaultValue: 'Создание современных веб-приложений'
      },
      {
        field: 'card1_button',
        label: 'Карточка 1 - Кнопка',
        type: 'text',
        rules: [],
        defaultValue: 'Подробнее'
      },
      {
        field: 'card1_link',
        label: 'Карточка 1 - Ссылка',
        type: 'text',
        rules: [],
        defaultValue: 'https://example.com'
      },
      {
        field: 'card1_image',
        label: 'Карточка 1 - Изображение',
        type: 'text',
        rules: [],
        defaultValue: '/2.jpg'
      },
      // Карточка 2
      {
        field: 'card2_title',
        label: 'Карточка 2 - Заголовок',
        type: 'text',
        rules: [],
        defaultValue: 'Мобильные приложения'
      },
      {
        field: 'card2_text',
        label: 'Карточка 2 - Текст',
        type: 'textarea',
        rules: [],
        defaultValue: 'Разработка мобильных приложений для iOS и Android'
      },
      {
        field: 'card2_button',
        label: 'Карточка 2 - Кнопка',
        type: 'text',
        rules: [],
        defaultValue: 'Узнать больше'
      },
      {
        field: 'card2_link',
        label: 'Карточка 2 - Ссылка',
        type: 'text',
        rules: [],
        defaultValue: 'https://example.com'
      },
      {
        field: 'card2_image',
        label: 'Карточка 2 - Изображение',
        type: 'text',
        rules: [],
        defaultValue: '/spanch.jpg'
      },
      // Карточка 3
      {
        field: 'card3_title',
        label: 'Карточка 3 - Заголовок',
        type: 'text',
        rules: [],
        defaultValue: 'Дизайн'
      },
      {
        field: 'card3_text',
        label: 'Карточка 3 - Текст',
        type: 'textarea',
        rules: [],
        defaultValue: 'Создание уникального дизайна для вашего бренда'
      },
      {
        field: 'card3_button',
        label: 'Карточка 3 - Кнопка',
        type: 'text',
        rules: [],
        defaultValue: 'Посмотреть работы'
      },
      {
        field: 'card3_link',
        label: 'Карточка 3 - Ссылка',
        type: 'text',
        rules: [],
        defaultValue: 'https://example.com'
      },
      {
        field: 'card3_image',
        label: 'Карточка 3 - Изображение',
        type: 'text',
        rules: [],
        defaultValue: '/bear.jpg'
      },
      // Настройки отображения
      {
        field: 'cardBackground',
        label: 'Цвет фона карточек',
        type: 'color',
        rules: [],
        defaultValue: '#ffffff'
      },
      {
        field: 'cardTextColor',
        label: 'Цвет текста карточек',
        type: 'color',
        rules: [],
        defaultValue: '#333333'
      },
      {
        field: 'cardBorderRadius',
        label: 'Скругление карточек',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 8
      },
      {
        field: 'columns',
        label: 'Количество колонок',
        type: 'select',
        options: [
          { value: '1', label: '1 колонка' },
          { value: '2', label: '2 колонки' },
          { value: '3', label: '3 колонки' },
          { value: '4', label: '4 колонки' }
        ],
        rules: [],
        defaultValue: '3'
      },
      {
        field: 'gap',
        label: 'Расстояние между карточками',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 100, message: 'Максимум: 100' }
        ],
        defaultValue: 16
      }
    ]
  },

  feature: {
    title: 'Карточка возможности',
    icon: '⭐',
    description: 'Карточка для описания фичи или преимущества',
    render: {
      kind: 'component',
      framework: 'vue',
      component: FeatureCard
    },
    fields: [
      {
        field: 'icon',
        label: 'Иконка (emoji)',
        type: 'text',
        placeholder: '🚀',
        rules: [],
        defaultValue: '🚀'
      },
      {
        field: 'title',
        label: 'Заголовок',
        type: 'text',
        placeholder: 'Быстрая работа',
        rules: [{ type: 'required', message: 'Заголовок обязателен' }],
        defaultValue: 'Быстрая работа'
      },
      {
        field: 'description',
        label: 'Описание',
        type: 'textarea',
        placeholder: 'Молниеносная скорость загрузки...',
        rules: [{ type: 'required', message: 'Описание обязательно' }],
        defaultValue: 'Молниеносная скорость загрузки и отличная производительность'
      }
    ],
    // Демонстрация использования padding для карточки с фоном
    spacingOptions: {
      spacingTypes: ['padding-top', 'padding-bottom', 'margin-bottom'],
      config: {
        min: 0,
        max: 100,
        step: 5
      }
    }
  },

  gallerySlider: {
    title: 'Слайдер галереи',
    icon: '🎠',
    description: '✅ НАСТОЯЩИЙ Swiper из npm пакета! (только с полноценной сборкой)',
    render: {
      kind: 'component',
      framework: 'vue',
      component: GallerySliderBlock
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок галереи',
        type: 'text',
        placeholder: 'Галерея изображений',
        rules: [],
        defaultValue: 'Галерея изображений'
      },
      // Изображение 1
      {
        field: 'image1_url',
        label: 'Изображение 1 - URL',
        type: 'text',
        rules: [{ type: 'required', message: 'URL обязателен' }],
        defaultValue: '/2.jpg'
      },
      {
        field: 'image1_title',
        label: 'Изображение 1 - Заголовок',
        type: 'text',
        rules: [{ type: 'required', message: 'Заголовок обязателен' }],
        defaultValue: 'Изображение 1'
      },
      {
        field: 'image1_description',
        label: 'Изображение 1 - Описание',
        type: 'textarea',
        rules: [],
        defaultValue: 'Описание первого изображения'
      },
      // Изображение 2
      {
        field: 'image2_url',
        label: 'Изображение 2 - URL',
        type: 'text',
        rules: [],
        defaultValue: '/spanch.jpg'
      },
      {
        field: 'image2_title',
        label: 'Изображение 2 - Заголовок',
        type: 'text',
        rules: [],
        defaultValue: 'Изображение 2'
      },
      {
        field: 'image2_description',
        label: 'Изображение 2 - Описание',
        type: 'textarea',
        rules: [],
        defaultValue: 'Описание второго изображения'
      },
      // Изображение 3
      {
        field: 'image3_url',
        label: 'Изображение 3 - URL',
        type: 'text',
        rules: [],
        defaultValue: '/bear.jpg'
      },
      {
        field: 'image3_title',
        label: 'Изображение 3 - Заголовок',
        type: 'text',
        rules: [],
        defaultValue: 'Изображение 3'
      },
      {
        field: 'image3_description',
        label: 'Изображение 3 - Описание',
        type: 'textarea',
        rules: [],
        defaultValue: 'Описание третьего изображения'
      },
      // Изображение 4
      {
        field: 'image4_url',
        label: 'Изображение 4 - URL',
        type: 'text',
        rules: [],
        defaultValue: '/3.png'
      },
      {
        field: 'image4_title',
        label: 'Изображение 4 - Заголовок',
        type: 'text',
        rules: [],
        defaultValue: 'Изображение 4'
      },
      {
        field: 'image4_description',
        label: 'Изображение 4 - Описание',
        type: 'textarea',
        rules: [],
        defaultValue: 'Описание четвёртого изображения'
      },
      // Настройки слайдера
      {
        field: 'autoplay',
        label: 'Автопрокрутка',
        type: 'checkbox',
        rules: [],
        defaultValue: true
      },
      {
        field: 'autoplayDelay',
        label: 'Задержка (мс)',
        type: 'number',
        rules: [
          { type: 'min', value: 1000, message: 'Минимум: 1000мс' },
          { type: 'max', value: 10000, message: 'Максимум: 10000мс' }
        ],
        defaultValue: 3000
      },
      {
        field: 'loop',
        label: 'Зациклить',
        type: 'checkbox',
        rules: [],
        defaultValue: true
      },
      {
        field: 'spaceBetween',
        label: 'Расстояние между слайдами',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 100, message: 'Максимум: 100' }
        ],
        defaultValue: 30
      }
    ]
  },

  counter: {
    title: 'Счётчик',
    icon: '🔢',
    description: '✅ АСИНХРОННЫЙ компонент! Загружается только при использовании',
    render: {
      kind: 'component',
      framework: 'vue',
      component: Counter
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок',
        type: 'text',
        placeholder: 'Счётчик',
        rules: [{ type: 'required', message: 'Заголовок обязателен' }],
        defaultValue: 'Счётчик'
      },
      {
        field: 'description',
        label: 'Описание',
        type: 'textarea',
        placeholder: 'Описание счётчика',
        rules: [],
        defaultValue: 'Интерактивный счётчик с настройками'
      },
      {
        field: 'initialValue',
        label: 'Начальное значение',
        type: 'number',
        rules: [{ type: 'required', message: 'Начальное значение обязательно' }],
        defaultValue: 0
      },
      {
        field: 'min',
        label: 'Минимальное значение',
        type: 'number',
        rules: [{ type: 'required', message: 'Минимум обязателен' }],
        defaultValue: 0
      },
      {
        field: 'max',
        label: 'Максимальное значение (0 = без ограничений)',
        type: 'number',
        rules: [],
        defaultValue: 100
      },
      {
        field: 'step',
        label: 'Шаг изменения',
        type: 'number',
        rules: [
          { type: 'required', message: 'Шаг обязателен' },
          { type: 'min', value: 1, message: 'Минимум: 1' }
        ],
        defaultValue: 1
      },
      {
        field: 'showReset',
        label: 'Показать кнопку сброса',
        type: 'checkbox',
        rules: [],
        defaultValue: true
      },
      {
        field: 'showProgress',
        label: 'Показать прогресс-бар',
        type: 'checkbox',
        rules: [],
        defaultValue: true
      },
      {
        field: 'incrementText',
        label: 'Текст кнопки увеличения',
        type: 'text',
        rules: [],
        defaultValue: 'Увеличить'
      },
      {
        field: 'decrementText',
        label: 'Текст кнопки уменьшения',
        type: 'text',
        rules: [],
        defaultValue: 'Уменьшить'
      },
      {
        field: 'resetText',
        label: 'Текст кнопки сброса',
        type: 'text',
        rules: [],
        defaultValue: 'Сбросить'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет фона обязателен' }],
        defaultValue: '#f5f5f5'
      },
      {
        field: 'primaryColor',
        label: 'Основной цвет',
        type: 'color',
        rules: [{ type: 'required', message: 'Основной цвет обязателен' }],
        defaultValue: '#007bff'
      },
      {
        field: 'textColor',
        label: 'Цвет текста',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет текста обязателен' }],
        defaultValue: '#333333'
      },
      {
        field: 'buttonColor',
        label: 'Цвет кнопок',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет кнопок обязателен' }],
        defaultValue: '#007bff'
      },
      {
        field: 'buttonTextColor',
        label: 'Цвет текста кнопок',
        type: 'color',
        rules: [{ type: 'required', message: 'Цвет текста кнопок обязателен' }],
        defaultValue: '#ffffff'
      },
      {
        field: 'titleSize',
        label: 'Размер заголовка',
        type: 'number',
        rules: [
          { type: 'min', value: 12, message: 'Минимум: 12px' },
          { type: 'max', value: 48, message: 'Максимум: 48px' }
        ],
        defaultValue: 24
      },
      {
        field: 'valueSize',
        label: 'Размер значения',
        type: 'number',
        rules: [
          { type: 'min', value: 24, message: 'Минимум: 24px' },
          { type: 'max', value: 96, message: 'Максимум: 96px' }
        ],
        defaultValue: 48
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум: 0' },
          { type: 'max', value: 50, message: 'Максимум: 50' }
        ],
        defaultValue: 12
      }
    ]
  },

  // 🆕 ПРИМЕР: Блок с ЯВНЫМ spacing полем (не автоматическим)
  spacedContent: {
    title: 'Контент с отступами (ручной)',
    icon: '📐',
    description: 'Блок с явно определённым spacing полем',
    render: {
      kind: 'component',
      framework: 'vue',
      component: SpacedContentBlock
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок',
        type: 'text',
        placeholder: 'Введите заголовок...',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Заголовок секции'
      },
      {
        field: 'content',
        label: 'Контент',
        type: 'textarea',
        placeholder: 'Введите контент...',
        rules: [
          { type: 'required', message: 'Контент обязателен' }
        ],
        defaultValue: '<p>Это пример контента с настраиваемыми отступами.</p><p>Отступы можно настроить отдельно для каждого брекпоинта.</p>'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        rules: [],
        defaultValue: '#f8f9fa'
      },
      {
        field: 'spacing',
        label: 'Отступы блока',
        type: 'spacing',
        spacingConfig: {
          // Какие типы отступов доступны (по умолчанию все 4)
          spacingTypes: ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'],
          // Диапазон значений
          min: 0,
          max: 200,
          step: 4
          // breakpoints не указан - будут использованы дефолтные (desktop, tablet, mobile)
          // Если нужны кастомные брекпоинты:
          // breakpoints: [
          //   { name: 'desktop', label: 'Десктоп', maxWidth: undefined },
          //   { name: 'wide', label: 'Широкий экран', maxWidth: 1920 },
          //   { name: 'tablet', label: 'Планшет', maxWidth: 1024 },
          //   { name: 'mobile', label: 'Телефон', maxWidth: 767 }
          // ]
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
    ]
  }
}

