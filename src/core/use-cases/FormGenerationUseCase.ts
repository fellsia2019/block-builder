import { BlockEntity } from '../entities/Block';
import { FormGenerationConfig, ValidationResult, FormData } from '../entities/ValidationRule';
import { JavaScriptFormGenerator } from '../../utils/validation';
import { VueFormGenerator } from '../../utils/vueValidation';

/**
 * Use Case для генерации форм создания и редактирования блоков
 */
export class FormGenerationUseCase {
  /**
   * Генерирует HTML форму для создания/редактирования блока (для чистого JS)
   */
  generateJavaScriptForm(
    blockType: string, 
    config: FormGenerationConfig, 
    onSubmit: (data: FormData) => void
  ): string {
    return JavaScriptFormGenerator.generateForm(config, onSubmit);
  }

  /**
   * Генерирует Vue3 компонент формы
   */
  generateVueForm(config: FormGenerationConfig): string {
    return VueFormGenerator.generateFormComponent(config);
  }

  /**
   * Создает конфигурацию формы для блока на основе его типа
   */
  createFormConfigForBlockType(blockType: string): FormGenerationConfig {
    const configs: Record<string, FormGenerationConfig> = {
      'text': {
        title: 'Настройка текстового блока',
        description: 'Настройте параметры текстового блока',
        fields: [
          {
            field: 'content',
            label: 'Текст',
            type: 'textarea',
            placeholder: 'Введите текст...',
            rules: [
              {
                type: 'required',
                field: 'content',
                message: 'Текст обязателен для заполнения'
              },
              {
                type: 'minLength',
                field: 'content',
                value: 1,
                message: 'Текст не может быть пустым'
              }
            ],
            defaultValue: ''
          },
          {
            field: 'fontSize',
            label: 'Размер шрифта',
            type: 'number',
            rules: [
              {
                type: 'required',
                field: 'fontSize',
                message: 'Размер шрифта обязателен'
              },
              {
                type: 'min',
                field: 'fontSize',
                value: 8,
                message: 'Минимальный размер шрифта: 8px'
              },
              {
                type: 'max',
                field: 'fontSize',
                value: 72,
                message: 'Максимальный размер шрифта: 72px'
              }
            ],
            defaultValue: 16
          },
          {
            field: 'color',
            label: 'Цвет текста',
            type: 'color',
            rules: [
              {
                type: 'required',
                field: 'color',
                message: 'Цвет обязателен'
              }
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
              {
                type: 'required',
                field: 'textAlign',
                message: 'Выравнивание обязательно'
              }
            ],
            defaultValue: 'left'
          }
        ],
        submitButtonText: 'Создать блок',
        cancelButtonText: 'Отмена'
      },
      'image': {
        title: 'Настройка блока изображения',
        description: 'Настройте параметры блока изображения',
        fields: [
          {
            field: 'src',
            label: 'URL изображения',
            type: 'url',
            placeholder: 'https://example.com/image.jpg',
            rules: [
              {
                type: 'required',
                field: 'src',
                message: 'URL изображения обязателен'
              },
              {
                type: 'url',
                field: 'src',
                message: 'Введите корректный URL'
              }
            ],
            defaultValue: ''
          },
          {
            field: 'alt',
            label: 'Альтернативный текст',
            type: 'text',
            placeholder: 'Описание изображения',
            rules: [
              {
                type: 'required',
                field: 'alt',
                message: 'Альтернативный текст обязателен'
              }
            ],
            defaultValue: ''
          },
          {
            field: 'borderRadius',
            label: 'Скругление углов',
            type: 'number',
            rules: [
              {
                type: 'min',
                field: 'borderRadius',
                value: 0,
                message: 'Скругление не может быть отрицательным'
              },
              {
                type: 'max',
                field: 'borderRadius',
                value: 50,
                message: 'Максимальное скругление: 50px'
              }
            ],
            defaultValue: 0
          },
          {
            field: 'width',
            label: 'Ширина',
            type: 'number',
            rules: [
              {
                type: 'required',
                field: 'width',
                message: 'Ширина обязательна'
              },
              {
                type: 'min',
                field: 'width',
                value: 50,
                message: 'Минимальная ширина: 50px'
              },
              {
                type: 'max',
                field: 'width',
                value: 1200,
                message: 'Максимальная ширина: 1200px'
              }
            ],
            defaultValue: 300
          },
          {
            field: 'height',
            label: 'Высота',
            type: 'number',
            rules: [
              {
                type: 'required',
                field: 'height',
                message: 'Высота обязательна'
              },
              {
                type: 'min',
                field: 'height',
                value: 50,
                message: 'Минимальная высота: 50px'
              },
              {
                type: 'max',
                field: 'height',
                value: 800,
                message: 'Максимальная высота: 800px'
              }
            ],
            defaultValue: 200
          }
        ],
        submitButtonText: 'Создать блок',
        cancelButtonText: 'Отмена'
      },
      'button': {
        title: 'Настройка кнопки',
        description: 'Настройте параметры кнопки',
        fields: [
          {
            field: 'text',
            label: 'Текст кнопки',
            type: 'text',
            placeholder: 'Нажми меня',
            rules: [
              {
                type: 'required',
                field: 'text',
                message: 'Текст кнопки обязателен'
              },
              {
                type: 'minLength',
                field: 'text',
                value: 1,
                message: 'Текст не может быть пустым'
              }
            ],
            defaultValue: 'Кнопка'
          },
          {
            field: 'backgroundColor',
            label: 'Цвет фона',
            type: 'color',
            rules: [
              {
                type: 'required',
                field: 'backgroundColor',
                message: 'Цвет фона обязателен'
              }
            ],
            defaultValue: '#007bff'
          },
          {
            field: 'color',
            label: 'Цвет текста',
            type: 'color',
            rules: [
              {
                type: 'required',
                field: 'color',
                message: 'Цвет текста обязателен'
              }
            ],
            defaultValue: '#ffffff'
          },
          {
            field: 'borderRadius',
            label: 'Скругление углов',
            type: 'number',
            rules: [
              {
                type: 'min',
                field: 'borderRadius',
                value: 0,
                message: 'Скругление не может быть отрицательным'
              },
              {
                type: 'max',
                field: 'borderRadius',
                value: 50,
                message: 'Максимальное скругление: 50px'
              }
            ],
            defaultValue: 4
          },
          {
            field: 'padding',
            label: 'Отступы',
            type: 'text',
            placeholder: '8px 16px',
            rules: [
              {
                type: 'required',
                field: 'padding',
                message: 'Отступы обязательны'
              }
            ],
            defaultValue: '8px 16px'
          },
          {
            field: 'onClick',
            label: 'Обработчик клика',
            type: 'text',
            placeholder: 'alert("Привет!")',
            rules: [
              {
                type: 'required',
                field: 'onClick',
                message: 'Обработчик клика обязателен'
              }
            ],
            defaultValue: 'alert("Привет!")'
          }
        ],
        submitButtonText: 'Создать кнопку',
        cancelButtonText: 'Отмена'
      }
    };

    return configs[blockType] || {
      title: `Настройка блока ${blockType}`,
      description: 'Настройте параметры блока',
      fields: [],
      submitButtonText: 'Создать блок',
      cancelButtonText: 'Отмена'
    };
  }

  /**
   * Создает конфигурацию формы для редактирования существующего блока
   */
  createEditFormConfig(block: BlockEntity): FormGenerationConfig {
    const baseConfig = this.createFormConfigForBlockType(block.type);
    
    // Заполняем значения по умолчанию из существующего блока
    const updatedFields = baseConfig.fields.map(field => ({
      ...field,
      defaultValue: block.props[field.field] || block.settings[field.field] || field.defaultValue
    }));

    return {
      ...baseConfig,
      title: `Редактирование блока ${block.type}`,
      description: 'Измените параметры блока',
      fields: updatedFields,
      submitButtonText: 'Сохранить изменения',
      cancelButtonText: 'Отмена'
    };
  }

  /**
   * Валидирует данные формы
   */
  async validateFormData(data: FormData, config: FormGenerationConfig): Promise<ValidationResult> {
    const { JavaScriptValidator } = await import('../../utils/validation');
    const allRules = config.fields.flatMap(field => field.rules);
    return JavaScriptValidator.validate(data, allRules);
  }
}
