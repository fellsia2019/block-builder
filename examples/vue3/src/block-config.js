/**
 * Конфигурация блоков для пользователя
 * Это пример ПРАВИЛЬНОГО использования BlockBuilder с полноценным Vue3 + Vite
 * 
 * ✅ Настоящие Vue SFC компоненты (.vue файлы)
 * ✅ Настоящий Swiper из npm пакета
 * ✅ Полноценная сборка с Vite
 * ✅ Все возможности современного фреймворка
 */

// Импорт настоящих Vue SFC компонентов
import TextBlock from './components/TextBlock.vue'
import ImageBlock from './components/ImageBlock.vue'
import ButtonBlock from './components/ButtonBlock.vue'
import CardListBlock from './components/CardListBlock.vue'
import HeroBlock from './components/HeroBlock.vue'
import GallerySliderBlock from './components/GallerySliderBlock.vue'

export const blockConfigs = {
  text: {
    title: 'Текстовый блок',
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
    ]
  },

  image: {
    title: 'Изображение',
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
    ]
  },

  cardList: {
    title: 'Список карточек',
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

  gallerySlider: {
    title: 'Слайдер галереи',
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
  }
}

