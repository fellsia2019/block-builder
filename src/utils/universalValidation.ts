/**
 * Универсальная система валидации для всех фреймворков
 * Поддерживает: Pure JS, Vue3, React, Angular и другие
 */

export type ValidationRuleType = 'required' | 'email' | 'url' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';

export interface ValidationRule {
  type: ValidationRuleType;
  field: string;
  value?: any;
  message: string;
  validator?: (value: any) => boolean; // Для кастомных правил
}

export type FieldType = 'text' | 'number' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'color' | 'file';

export interface FormFieldConfig {
  field: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: { value: string; label: string }[]; // Для типа 'select'
  rules?: ValidationRule[];
}

export interface FormGenerationConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
}

export interface FormData {
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Универсальный валидатор
 */
export class UniversalValidator {
  /**
   * Валидация одного поля
   */
  static validateField(value: any, rules: ValidationRule[]): string[] {
    const errors: string[] = [];
    
    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (value === null || value === undefined || value === '') {
            errors.push(rule.message);
          }
          break;
          
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(rule.message);
          }
          break;
          
        case 'url':
          if (value) {
            try {
              new URL(value);
            } catch {
              errors.push(rule.message);
            }
          }
          break;
          
        case 'min':
          if (value !== null && value !== undefined && parseFloat(value) < rule.value) {
            errors.push(rule.message);
          }
          break;
          
        case 'max':
          if (value !== null && value !== undefined && parseFloat(value) > rule.value) {
            errors.push(rule.message);
          }
          break;
          
        case 'minLength':
          if (value && value.length < rule.value) {
            errors.push(rule.message);
          }
          break;
          
        case 'maxLength':
          if (value && value.length > rule.value) {
            errors.push(rule.message);
          }
          break;
          
        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) {
            errors.push(rule.message);
          }
          break;
          
        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            errors.push(rule.message);
          }
          break;
      }
    }
    
    return errors;
  }

  /**
   * Валидация всей формы
   */
  static validateForm(formData: FormData, formFields: FormFieldConfig[]): ValidationResult {
    const formErrors: Record<string, string[]> = {};
    let isValid = true;

    for (const fieldConfig of formFields) {
      if (fieldConfig.rules && fieldConfig.rules.length > 0) {
        const errors = this.validateField(formData[fieldConfig.field], fieldConfig.rules);
        if (errors.length > 0) {
          formErrors[fieldConfig.field] = errors;
          isValid = false;
        }
      }
    }

    return {
      isValid,
      errors: formErrors
    };
  }

  /**
   * Создание валидатора для конкретного поля
   */
  static createFieldValidator(rules: ValidationRule[]) {
    return (value: any) => this.validateField(value, rules);
  }

  /**
   * Создание валидатора для всей формы
   */
  static createFormValidator(formFields: FormFieldConfig[]) {
    return (formData: FormData) => this.validateForm(formData, formFields);
  }
}

/**
 * Утилиты для работы с формами
 */
export class FormUtils {
  /**
   * Инициализация данных формы из конфигурации
   */
  static initializeFormData(fields: FormFieldConfig[]): FormData {
    const formData: FormData = {};
    
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        formData[field.field] = field.defaultValue;
      } else {
        switch (field.type) {
          case 'checkbox':
            formData[field.field] = false;
            break;
          case 'number':
            formData[field.field] = 0;
            break;
          default:
            formData[field.field] = '';
        }
      }
    });
    
    return formData;
  }

  /**
   * Очистка ошибок валидации
   */
  static clearErrors(errors: Record<string, string[]>): void {
    Object.keys(errors).forEach(key => delete errors[key]);
  }

  /**
   * Проверка, есть ли ошибки в форме
   */
  static hasErrors(errors: Record<string, string[]>): boolean {
    return Object.keys(errors).length > 0;
  }

  /**
   * Получение всех ошибок в виде массива
   */
  static getAllErrors(errors: Record<string, string[]>): string[] {
    const allErrors: string[] = [];
    Object.values(errors).forEach(fieldErrors => {
      allErrors.push(...fieldErrors);
    });
    return allErrors;
  }
}

/**
 * Предустановленные конфигурации форм для блоков
 */
export class BlockFormConfigs {
  static getTextBlockConfig(): FormGenerationConfig {
    return {
      title: 'Настройка текстового блока',
      description: 'Настройте параметры текстового блока',
      fields: [
        {
          field: 'content',
          label: 'Текст',
          type: 'textarea',
          placeholder: 'Введите текст...',
          rules: [
            { type: 'required', field: 'content', message: 'Текст обязателен для заполнения' },
            { type: 'minLength', field: 'content', value: 1, message: 'Текст не может быть пустым' }
          ],
          defaultValue: ''
        },
        {
          field: 'fontSize',
          label: 'Размер шрифта',
          type: 'number',
          rules: [
            { type: 'required', field: 'fontSize', message: 'Размер шрифта обязателен' },
            { type: 'min', field: 'fontSize', value: 8, message: 'Минимальный размер шрифта: 8px' },
            { type: 'max', field: 'fontSize', value: 72, message: 'Максимальный размер шрифта: 72px' }
          ],
          defaultValue: 16
        },
        {
          field: 'color',
          label: 'Цвет текста',
          type: 'color',
          rules: [
            { type: 'required', field: 'color', message: 'Цвет обязателен' }
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
            { type: 'required', field: 'textAlign', message: 'Выравнивание обязательно' }
          ],
          defaultValue: 'left'
        }
      ],
      submitButtonText: 'Создать блок',
      cancelButtonText: 'Отмена'
    };
  }

  static getImageBlockConfig(): FormGenerationConfig {
    return {
      title: 'Настройка блока изображения',
      description: 'Настройте параметры блока изображения',
      fields: [
        {
          field: 'src',
          label: 'URL изображения',
          type: 'url',
          placeholder: 'https://example.com/image.jpg',
          rules: [
            { type: 'required', field: 'src', message: 'URL изображения обязателен' },
            { type: 'url', field: 'src', message: 'Введите корректный URL' }
          ],
          defaultValue: ''
        },
        {
          field: 'alt',
          label: 'Альтернативный текст',
          type: 'text',
          placeholder: 'Описание изображения',
          rules: [
            { type: 'required', field: 'alt', message: 'Альтернативный текст обязателен' }
          ],
          defaultValue: ''
        },
        {
          field: 'borderRadius',
          label: 'Скругление углов',
          type: 'number',
          rules: [
            { type: 'min', field: 'borderRadius', value: 0, message: 'Скругление не может быть отрицательным' },
            { type: 'max', field: 'borderRadius', value: 50, message: 'Максимальное скругление: 50px' }
          ],
          defaultValue: 0
        }
      ],
      submitButtonText: 'Создать блок',
      cancelButtonText: 'Отмена'
    };
  }

  static getButtonBlockConfig(): FormGenerationConfig {
    return {
      title: 'Настройка кнопки',
      description: 'Настройте параметры кнопки',
      fields: [
        {
          field: 'text',
          label: 'Текст кнопки',
          type: 'text',
          placeholder: 'Нажми меня',
          rules: [
            { type: 'required', field: 'text', message: 'Текст кнопки обязателен' },
            { type: 'minLength', field: 'text', value: 1, message: 'Текст не может быть пустым' }
          ],
          defaultValue: 'Кнопка'
        },
        {
          field: 'backgroundColor',
          label: 'Цвет фона',
          type: 'color',
          rules: [
            { type: 'required', field: 'backgroundColor', message: 'Цвет фона обязателен' }
          ],
          defaultValue: '#007bff'
        },
        {
          field: 'color',
          label: 'Цвет текста',
          type: 'color',
          rules: [
            { type: 'required', field: 'color', message: 'Цвет текста обязателен' }
          ],
          defaultValue: '#ffffff'
        },
        {
          field: 'borderRadius',
          label: 'Скругление углов',
          type: 'number',
          rules: [
            { type: 'min', field: 'borderRadius', value: 0, message: 'Скругление не может быть отрицательным' },
            { type: 'max', field: 'borderRadius', value: 50, message: 'Максимальное скругление: 50px' }
          ],
          defaultValue: 4
        },
        {
          field: 'padding',
          label: 'Отступы',
          type: 'text',
          placeholder: '8px 16px',
          rules: [
            { type: 'required', field: 'padding', message: 'Отступы обязательны' }
          ],
          defaultValue: '8px 16px'
        },
        {
          field: 'onClick',
          label: 'Обработчик клика',
          type: 'text',
          placeholder: 'alert("Привет!")',
          rules: [
            { type: 'required', field: 'onClick', message: 'Обработчик клика обязателен' }
          ],
          defaultValue: 'alert("Привет!")'
        }
      ],
      submitButtonText: 'Создать кнопку',
      cancelButtonText: 'Отмена'
    };
  }

  static getCardListBlockConfig(): FormGenerationConfig {
    return {
      title: 'Настройка списка карточек',
      description: 'Настройте параметры списка карточек',
      fields: [
        {
          field: 'title',
          label: 'Заголовок списка',
          type: 'text',
          placeholder: 'Наши услуги',
          rules: [
            { type: 'required', field: 'title', message: 'Заголовок обязателен' },
            { type: 'minLength', field: 'title', value: 1, message: 'Заголовок не может быть пустым' }
          ],
          defaultValue: 'Наши услуги'
        },
        {
          field: 'card1_title',
          label: 'Карточка 1 - Заголовок',
          type: 'text',
          placeholder: 'Веб-разработка',
          rules: [
            { type: 'required', field: 'card1_title', message: 'Заголовок карточки обязателен' }
          ],
          defaultValue: 'Веб-разработка'
        },
        {
          field: 'card1_text',
          label: 'Карточка 1 - Описание',
          type: 'textarea',
          placeholder: 'Создание современных веб-приложений',
          rules: [
            { type: 'required', field: 'card1_text', message: 'Описание карточки обязательно' }
          ],
          defaultValue: 'Создание современных веб-приложений'
        },
        {
          field: 'card1_button',
          label: 'Карточка 1 - Текст кнопки',
          type: 'text',
          placeholder: 'Подробнее',
          rules: [
            { type: 'required', field: 'card1_button', message: 'Текст кнопки обязателен' }
          ],
          defaultValue: 'Подробнее'
        },
        {
          field: 'card1_link',
          label: 'Карточка 1 - Ссылка',
          type: 'url',
          placeholder: 'https://example.com',
          rules: [
            { type: 'required', field: 'card1_link', message: 'Ссылка обязательна' }
          ],
          defaultValue: 'https://example.com'
        },
        {
          field: 'card1_image',
          label: 'Карточка 1 - Изображение',
          type: 'url',
          placeholder: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg',
          rules: [
            { type: 'required', field: 'card1_image', message: 'Изображение обязательно' }
          ],
          defaultValue: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg'
        },
        {
          field: 'card2_title',
          label: 'Карточка 2 - Заголовок',
          type: 'text',
          placeholder: 'Мобильные приложения',
          rules: [
            { type: 'required', field: 'card2_title', message: 'Заголовок карточки обязателен' }
          ],
          defaultValue: 'Мобильные приложения'
        },
        {
          field: 'card2_text',
          label: 'Карточка 2 - Описание',
          type: 'textarea',
          placeholder: 'Разработка мобильных приложений для iOS и Android',
          rules: [
            { type: 'required', field: 'card2_text', message: 'Описание карточки обязательно' }
          ],
          defaultValue: 'Разработка мобильных приложений для iOS и Android'
        },
        {
          field: 'card2_button',
          label: 'Карточка 2 - Текст кнопки',
          type: 'text',
          placeholder: 'Узнать больше',
          rules: [
            { type: 'required', field: 'card2_button', message: 'Текст кнопки обязателен' }
          ],
          defaultValue: 'Узнать больше'
        },
        {
          field: 'card2_link',
          label: 'Карточка 2 - Ссылка',
          type: 'url',
          placeholder: 'https://example.com',
          rules: [
            { type: 'required', field: 'card2_link', message: 'Ссылка обязательна' }
          ],
          defaultValue: 'https://example.com'
        },
        {
          field: 'card2_image',
          label: 'Карточка 2 - Изображение',
          type: 'url',
          placeholder: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg',
          rules: [
            { type: 'required', field: 'card2_image', message: 'Изображение обязательно' }
          ],
          defaultValue: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg'
        },
        {
          field: 'card3_title',
          label: 'Карточка 3 - Заголовок',
          type: 'text',
          placeholder: 'Дизайн',
          rules: [
            { type: 'required', field: 'card3_title', message: 'Заголовок карточки обязателен' }
          ],
          defaultValue: 'Дизайн'
        },
        {
          field: 'card3_text',
          label: 'Карточка 3 - Описание',
          type: 'textarea',
          placeholder: 'Создание уникального дизайна для вашего бренда',
          rules: [
            { type: 'required', field: 'card3_text', message: 'Описание карточки обязательно' }
          ],
          defaultValue: 'Создание уникального дизайна для вашего бренда'
        },
        {
          field: 'card3_button',
          label: 'Карточка 3 - Текст кнопки',
          type: 'text',
          placeholder: 'Посмотреть работы',
          rules: [
            { type: 'required', field: 'card3_button', message: 'Текст кнопки обязателен' }
          ],
          defaultValue: 'Посмотреть работы'
        },
        {
          field: 'card3_link',
          label: 'Карточка 3 - Ссылка',
          type: 'url',
          placeholder: 'https://example.com',
          rules: [
            { type: 'required', field: 'card3_link', message: 'Ссылка обязательна' }
          ],
          defaultValue: 'https://example.com'
        },
        {
          field: 'card3_image',
          label: 'Карточка 3 - Изображение',
          type: 'url',
          placeholder: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg',
          rules: [
            { type: 'required', field: 'card3_image', message: 'Изображение обязательно' }
          ],
          defaultValue: 'https://i.pinimg.com/736x/ca/9a/12/ca9a123b7269fba0574726629bad42b9.jpg'
        },
        {
          field: 'cardBackground',
          label: 'Цвет фона карточек',
          type: 'color',
          rules: [
            { type: 'required', field: 'cardBackground', message: 'Цвет фона обязателен' }
          ],
          defaultValue: '#ffffff'
        },
        {
          field: 'cardTextColor',
          label: 'Цвет текста карточек',
          type: 'color',
          rules: [
            { type: 'required', field: 'cardTextColor', message: 'Цвет текста обязателен' }
          ],
          defaultValue: '#333333'
        },
        {
          field: 'cardBorderRadius',
          label: 'Скругление карточек',
          type: 'number',
          rules: [
            { type: 'min', field: 'cardBorderRadius', value: 0, message: 'Скругление не может быть отрицательным' },
            { type: 'max', field: 'cardBorderRadius', value: 50, message: 'Максимальное скругление: 50px' }
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
            { type: 'required', field: 'columns', message: 'Количество колонок обязательно' }
          ],
          defaultValue: '3'
        },
        {
          field: 'gap',
          label: 'Отступ между карточками',
          type: 'number',
          rules: [
            { type: 'min', field: 'gap', value: 0, message: 'Отступ не может быть отрицательным' },
            { type: 'max', field: 'gap', value: 50, message: 'Максимальный отступ: 50px' }
          ],
          defaultValue: 16
        }
      ],
      submitButtonText: 'Создать список карточек',
      cancelButtonText: 'Отмена'
    };
  }

  /**
   * Получить конфигурацию для типа блока
   */
  static getConfigForBlockType(blockType: string): FormGenerationConfig {
    switch (blockType) {
      case 'text':
        return this.getTextBlockConfig();
      case 'image':
        return this.getImageBlockConfig();
      case 'button':
        return this.getButtonBlockConfig();
      case 'cardlist':
        return this.getCardListBlockConfig();
      default:
        throw new Error(`Неизвестный тип блока: ${blockType}`);
    }
  }

  /**
   * Создать конфигурацию для редактирования блока
   */
  static createEditConfig(blockType: string, blockData: FormData): FormGenerationConfig {
    const config = this.getConfigForBlockType(blockType);
    
    // Обновляем заголовок и кнопку
    config.title = `Редактирование ${config.title.toLowerCase().replace('настройка ', '')}`;
    config.submitButtonText = 'Сохранить изменения';

    // Заполняем значения по умолчанию из данных блока
    config.fields.forEach(field => {
      if (blockData[field.field] !== undefined) {
        field.defaultValue = blockData[field.field];
      }
    });

    return config;
  }
}
