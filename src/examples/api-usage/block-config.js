/**
 * Конфигурация блоков для демонстрации API
 * Показывает минимальную конфигурацию для работы с основным BlockBuilder API
 */

export const blockConfigs = {
  text: {
    title: 'Текстовый блок',
    description: 'Добавьте текстовый контент на страницу',
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        rules: [
          { type: 'required', message: 'Текст обязателен' }
        ]
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
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
        defaultValue: 'left'
      }
    ]
  },

  image: {
    title: 'Блок изображения',
    description: 'Добавьте изображение на страницу',
    fields: [
      {
        field: 'src',
        label: 'URL изображения',
        type: 'url',
        rules: [
          { type: 'required', message: 'URL изображения обязателен' },
          { type: 'url', message: 'Введите корректный URL' }
        ]
      },
      {
        field: 'alt',
        label: 'Альтернативный текст',
        type: 'text',
        defaultValue: ''
      },
      {
        field: 'caption',
        label: 'Подпись',
        type: 'text',
        defaultValue: ''
      }
    ]
  }
};
