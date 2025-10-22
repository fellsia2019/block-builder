/**
 * Конфигурация блоков для пользователя
 * Пользователь настраивает только типы блоков, их поля и правила валидации
 * Шаблоны рендеринга и UI компоненты предоставляет пакет
 */

// Импорт реальных Vue компонентов
import TextBlock from './components/TextBlock.js'
import ImageBlock from './components/ImageBlock.js'
import ButtonBlock from './components/ButtonBlock.js'
import CardListBlock from './components/CardListBlock.js'
import HeroBlock from './components/HeroBlock.js'
import GallerySliderBlock from './components/GallerySliderBlock.js'

export const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    description: 'Добавьте текстовый контент на страницу',
    // Новый формат render
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
        rules: [
          { type: 'required', message: 'Цвет обязателен' }
        ],
        defaultValue: '#333333'
      },
      {
        field: 'textAlign',
        label: 'Выравнивание',
        type: 'select',
        options: [
          { value: 'left', label: 'По левому краю' },
          { value: 'center', label: 'По центру' },
          { value: 'right', label: 'По правому краю' },
          { value: 'justify', label: 'По ширине' }
        ],
        rules: [
          { type: 'required', message: 'Выравнивание обязательно' }
        ],
        defaultValue: 'left'
      }
    ]
  },

  image: {
    title: 'Блок изображения',
    description: 'Добавьте изображение на страницу',
    // Новый формат render
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
          { type: 'required', message: 'URL изображения обязателен' }
        ],
        defaultValue: '../static-files/img/1364537351_peyzazhi-na-rabochiy-stol-1.jpeg'
      },
      {
        field: 'alt',
        label: 'Альтернативный текст',
        type: 'text',
        placeholder: 'Описание изображения',
        rules: [
          { type: 'required', message: 'Альтернативный текст обязателен' }
        ],
        defaultValue: ''
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Скругление не может быть отрицательным' },
          { type: 'max', value: 50, message: 'Максимальное скругление: 50px' }
        ],
        defaultValue: 0
      }
    ]
  },

  button: {
    title: 'Кнопка',
    description: 'Добавьте интерактивную кнопку',
    // Новый формат render
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
        defaultValue: 'Кнопка'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        rules: [
          { type: 'required', message: 'Цвет фона обязателен' }
        ],
        defaultValue: '#007bff'
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [
          { type: 'required', message: 'Цвет текста обязателен' }
        ],
        defaultValue: '#ffffff'
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Скругление не может быть отрицательным' },
          { type: 'max', value: 50, message: 'Максимальное скругление: 50px' }
        ],
        defaultValue: 4
      },
      {
        field: 'padding',
        label: 'Отступы',
        type: 'text',
        placeholder: '8px 16px',
        rules: [
          { type: 'required', message: 'Отступы обязательны' }
        ],
        defaultValue: '8px 16px'
      },
    ]
  },

  cardlist: {
    title: 'Список карточек',
    description: 'Создайте список карточек с информацией',
    // Новый формат render
    render: {
      kind: 'component',
      framework: 'vue',
      component: CardListBlock
    },
    fields: [
      {
        field: 'title',
        label: 'Заголовок списка',
        type: 'text',
        placeholder: 'Наши услуги',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' },
          { type: 'minLength', value: 1, message: 'Заголовок не может быть пустым' }
        ],
        defaultValue: 'Наши услуги'
      },
      {
        field: 'card1_title',
        label: 'Карточка 1 - Заголовок',
        type: 'text',
        placeholder: 'Веб-разработка',
        rules: [
          { type: 'required', message: 'Заголовок карточки обязателен' }
        ],
        defaultValue: 'Веб-разработка'
      },
      {
        field: 'card1_text',
        label: 'Карточка 1 - Описание',
        type: 'textarea',
        placeholder: 'Создание современных веб-приложений',
        rules: [
          { type: 'required', message: 'Описание карточки обязательно' }
        ],
        defaultValue: 'Создание современных веб-приложений'
      },
      {
        field: 'card1_button',
        label: 'Карточка 1 - Текст кнопки',
        type: 'text',
        placeholder: 'Подробнее',
        rules: [
          { type: 'required', message: 'Текст кнопки обязателен' }
        ],
        defaultValue: 'Подробнее'
      },
      {
        field: 'card1_link',
        label: 'Карточка 1 - Ссылка',
        type: 'url',
        placeholder: 'https://example.com',
        rules: [
          { type: 'required', message: 'Ссылка обязательна' }
        ],
        defaultValue: 'https://example.com'
      },
      {
        field: 'card1_image',
        label: 'Карточка 1 - Изображение',
        type: 'text',
        placeholder: 'https://example.com/image.jpg',
        rules: [
          { type: 'required', message: 'Изображение обязательно' }
        ],
        defaultValue: '../static-files/img/fwfw.jpg'
      },
      {
        field: 'card2_title',
        label: 'Карточка 2 - Заголовок',
        type: 'text',
        placeholder: 'Мобильные приложения',
        rules: [
          { type: 'required', message: 'Заголовок карточки обязателен' }
        ],
        defaultValue: 'Мобильные приложения'
      },
      {
        field: 'card2_text',
        label: 'Карточка 2 - Описание',
        type: 'textarea',
        placeholder: 'Разработка мобильных приложений для iOS и Android',
        rules: [
          { type: 'required', message: 'Описание карточки обязательно' }
        ],
        defaultValue: 'Разработка мобильных приложений для iOS и Android'
      },
      {
        field: 'card2_button',
        label: 'Карточка 2 - Текст кнопки',
        type: 'text',
        placeholder: 'Узнать больше',
        rules: [
          { type: 'required', message: 'Текст кнопки обязателен' }
        ],
        defaultValue: 'Узнать больше'
      },
      {
        field: 'card2_link',
        label: 'Карточка 2 - Ссылка',
        type: 'url',
        placeholder: 'https://example.com',
        rules: [
          { type: 'required', message: 'Ссылка обязательна' }
        ],
        defaultValue: 'https://example.com'
      },
      {
        field: 'card2_image',
        label: 'Карточка 2 - Изображение',
        type: 'text',
        placeholder: 'https://example.com/image.jpg',
        rules: [
          { type: 'required', message: 'Изображение обязательно' }
        ],
        defaultValue: '../static-files/img/fwfw.jpg'
      },
      {
        field: 'card3_title',
        label: 'Карточка 3 - Заголовок',
        type: 'text',
        placeholder: 'Дизайн',
        rules: [
          { type: 'required', message: 'Заголовок карточки обязателен' }
        ],
        defaultValue: 'Дизайн'
      },
      {
        field: 'card3_text',
        label: 'Карточка 3 - Описание',
        type: 'textarea',
        placeholder: 'Создание уникального дизайна для вашего бренда',
        rules: [
          { type: 'required', message: 'Описание карточки обязательно' }
        ],
        defaultValue: 'Создание уникального дизайна для вашего бренда'
      },
      {
        field: 'card3_button',
        label: 'Карточка 3 - Текст кнопки',
        type: 'text',
        placeholder: 'Посмотреть работы',
        rules: [
          { type: 'required', message: 'Текст кнопки обязателен' }
        ],
        defaultValue: 'Посмотреть работы'
      },
      {
        field: 'card3_link',
        label: 'Карточка 3 - Ссылка',
        type: 'url',
        placeholder: 'https://example.com',
        rules: [
          { type: 'required', message: 'Ссылка обязательна' }
        ],
        defaultValue: 'https://example.com'
      },
      {
        field: 'card3_image',
        label: 'Карточка 3 - Изображение',
        type: 'text',
        placeholder: 'https://example.com/image.jpg',
        rules: [
          { type: 'required', message: 'Изображение обязательно' }
        ],
        defaultValue: '../static-files/img/fwfw.jpg'
      },
      {
        field: 'cardBackground',
        label: 'Цвет фона карточек',
        type: 'color',
        rules: [
          { type: 'required', message: 'Цвет фона обязателен' }
        ],
        defaultValue: '#ffffff'
      },
      {
        field: 'cardTextColor',
        label: 'Цвет текста карточек',
        type: 'color',
        rules: [
          { type: 'required', message: 'Цвет текста обязателен' }
        ],
        defaultValue: '#333333'
      },
      {
        field: 'cardBorderRadius',
        label: 'Скругление карточек',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Скругление не может быть отрицательным' },
          { type: 'max', value: 50, message: 'Максимальное скругление: 50px' }
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
        rules: [
          { type: 'required', message: 'Количество колонок обязательно' }
        ],
        defaultValue: '3'
      },
      {
        field: 'gap',
        label: 'Отступ между карточками',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Отступ не может быть отрицательным' },
          { type: 'max', value: 50, message: 'Максимальный отступ: 50px' }
        ],
        defaultValue: 16
      }
    ]
  },

  hero: {
    title: 'Hero секция',
    description: 'Создайте привлекательную hero секцию',
    // Новый формат render
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
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Добро пожаловать'
      },
      {
        field: 'subtitle',
        label: 'Подзаголовок',
        type: 'textarea',
        placeholder: 'Создайте что-то удивительное',
        rules: [
          { type: 'required', message: 'Подзаголовок обязателен' }
        ],
        defaultValue: 'Создайте что-то удивительное'
      },
      {
        field: 'backgroundColor',
        label: 'Основной цвет фона',
        type: 'color',
        defaultValue: '#667eea'
      },
      {
        field: 'accentColor',
        label: 'Акцентный цвет',
        type: 'color',
        defaultValue: '#764ba2'
      },
      {
        field: 'textColor',
        label: 'Цвет текста',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        field: 'titleSize',
        label: 'Размер заголовка (px)',
        type: 'number',
        rules: [
          { type: 'min', value: 20, message: 'Минимальный размер: 20px' },
          { type: 'max', value: 80, message: 'Максимальный размер: 80px' }
        ],
        defaultValue: 48
      },
      {
        field: 'subtitleSize',
        label: 'Размер подзаголовка (px)',
        type: 'number',
        rules: [
          { type: 'min', value: 12, message: 'Минимальный размер: 12px' },
          { type: 'max', value: 32, message: 'Максимальный размер: 32px' }
        ],
        defaultValue: 20
      },
      {
        field: 'showButton',
        label: 'Показать кнопку',
        type: 'checkbox',
        defaultValue: true
      },
      {
        field: 'buttonText',
        label: 'Текст кнопки',
        type: 'text',
        defaultValue: 'Начать'
      },
      {
        field: 'buttonColor',
        label: 'Цвет кнопки',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        field: 'buttonTextColor',
        label: 'Цвет текста кнопки',
        type: 'color',
        defaultValue: '#333333'
      },
      {
        field: 'showDecorations',
        label: 'Показать декорации',
        type: 'checkbox',
        defaultValue: true
      }
    ]
  },

  gallerySlider: {
    title: 'Галерея со слайдером',
    description: 'Слайдер изображений с использованием Swiper.js',
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
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Галерея изображений'
      },
      {
        field: 'image1_url',
        label: 'Изображение 1 - URL',
        type: 'text',
        placeholder: 'https://example.com/image1.jpg',
        rules: [
          { type: 'required', message: 'URL изображения обязателен' }
        ],
        defaultValue: '../static-files/img/fwfw.jpg'
      },
      {
        field: 'image1_title',
        label: 'Изображение 1 - Заголовок',
        type: 'text',
        placeholder: 'Заголовок изображения',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Изображение 1'
      },
      {
        field: 'image1_description',
        label: 'Изображение 1 - Описание',
        type: 'textarea',
        placeholder: 'Описание изображения',
        rules: [
          { type: 'required', message: 'Описание обязательно' }
        ],
        defaultValue: 'Описание первого изображения'
      },
      {
        field: 'image2_url',
        label: 'Изображение 2 - URL',
        type: 'text',
        placeholder: 'https://example.com/image2.jpg',
        rules: [
          { type: 'required', message: 'URL изображения обязателен' }
        ],
        defaultValue: '../static-files/img/spanch.jpg'
      },
      {
        field: 'image2_title',
        label: 'Изображение 2 - Заголовок',
        type: 'text',
        placeholder: 'Заголовок изображения',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Изображение 2'
      },
      {
        field: 'image2_description',
        label: 'Изображение 2 - Описание',
        type: 'textarea',
        placeholder: 'Описание изображения',
        rules: [
          { type: 'required', message: 'Описание обязательно' }
        ],
        defaultValue: 'Описание второго изображения'
      },
      {
        field: 'image3_url',
        label: 'Изображение 3 - URL',
        type: 'text',
        placeholder: 'https://example.com/image3.jpg',
        rules: [
          { type: 'required', message: 'URL изображения обязателен' }
        ],
        defaultValue: '../static-files/img/мэдвэд.jpg'
      },
      {
        field: 'image3_title',
        label: 'Изображение 3 - Заголовок',
        type: 'text',
        placeholder: 'Заголовок изображения',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Изображение 3'
      },
      {
        field: 'image3_description',
        label: 'Изображение 3 - Описание',
        type: 'textarea',
        placeholder: 'Описание изображения',
        rules: [
          { type: 'required', message: 'Описание обязательно' }
        ],
        defaultValue: 'Описание третьего изображения'
      },
      {
        field: 'image4_url',
        label: 'Изображение 4 - URL',
        type: 'text',
        placeholder: 'https://example.com/image4.jpg',
        rules: [
          { type: 'required', message: 'URL изображения обязателен' }
        ],
        defaultValue: '../static-files/img/Квантовое_4D-кодирование_картинка.jpg'
      },
      {
        field: 'image4_title',
        label: 'Изображение 4 - Заголовок',
        type: 'text',
        placeholder: 'Заголовок изображения',
        rules: [
          { type: 'required', message: 'Заголовок обязателен' }
        ],
        defaultValue: 'Изображение 4'
      },
      {
        field: 'image4_description',
        label: 'Изображение 4 - Описание',
        type: 'textarea',
        placeholder: 'Описание изображения',
        rules: [
          { type: 'required', message: 'Описание обязательно' }
        ],
        defaultValue: 'Описание четвёртого изображения'
      },
      {
        field: 'autoplay',
        label: 'Автоматическая прокрутка',
        type: 'checkbox',
        defaultValue: true
      },
      {
        field: 'autoplayDelay',
        label: 'Задержка автопрокрутки (мс)',
        type: 'number',
        rules: [
          { type: 'min', value: 1000, message: 'Минимум 1000 мс' },
          { type: 'max', value: 10000, message: 'Максимум 10000 мс' }
        ],
        defaultValue: 3000
      },
      {
        field: 'loop',
        label: 'Бесконечная прокрутка',
        type: 'checkbox',
        defaultValue: true
      },
      {
        field: 'spaceBetween',
        label: 'Отступ между слайдами (px)',
        type: 'number',
        rules: [
          { type: 'min', value: 0, message: 'Минимум 0 px' },
          { type: 'max', value: 100, message: 'Максимум 100 px' }
        ],
        defaultValue: 30
      }
    ]
  }
};

// Шаблоны рендеринга предоставляет пакет
// Пользователь не должен создавать шаблоны - это делает пакет
