/**
 * FormBuilder - отвечает только за генерацию HTML форм
 * Принцип единой ответственности (SRP)
 */

import { IFormFieldConfig } from '../../core/types/form';

// Алиас для обратной совместимости
export type IFieldConfig = IFormFieldConfig;

export class FormBuilder {
  /**
   * Генерация HTML для формы создания
   */
  generateCreateFormHTML(fields: IFieldConfig[]): string {
    return fields.map(field => this.generateFieldHTML(field, field.defaultValue)).join('');
  }

  /**
   * Генерация HTML для формы редактирования
   */
  generateEditFormHTML(fields: IFieldConfig[], currentProps: Record<string, any>): string {
    return fields.map(field => {
      const currentValue = currentProps[field.field] || field.defaultValue || '';
      return this.generateFieldHTML(field, currentValue);
    }).join('');
  }

  /**
   * Генерация HTML для отдельного поля
   */
  private generateFieldHTML(field: IFieldConfig, value: any): string {
    const fieldId = `field-${field.field}`;
    const required = field.rules?.some(rule => rule.type === 'required') ? 'required' : '';

    switch (field.type) {
      case 'textarea':
        return this.generateTextareaHTML(fieldId, field, value, required);

      case 'select':
        return this.generateSelectHTML(fieldId, field, value, required);

      case 'number':
        return this.generateNumberHTML(fieldId, field, value, required);

      case 'color':
        return this.generateColorHTML(fieldId, field, value, required);

      case 'url':
        return this.generateUrlHTML(fieldId, field, value, required);

      case 'checkbox':
        return this.generateCheckboxHTML(fieldId, field, value);

      default: // text
        return this.generateTextHTML(fieldId, field, value, required);
    }
  }

  /**
   * Генерация textarea поля
   */
  private generateTextareaHTML(fieldId: string, field: IFieldConfig, value: any, required: string): string {
    return `
      <div class="block-builder-form-group">
        <label for="${fieldId}" class="block-builder-form-label">
          ${field.label} ${required ? '<span class="required">*</span>' : ''}
        </label>
        <textarea
          id="${fieldId}"
          name="${field.field}"
          class="block-builder-form-control"
          placeholder="${field.placeholder || ''}"
          ${required}
          rows="3"
        >${value || ''}</textarea>
      </div>
    `;
  }

  /**
   * Генерация select поля
   */
  private generateSelectHTML(fieldId: string, field: IFieldConfig, value: any, required: string): string {
    return `
      <div class="block-builder-form-group">
        <label for="${fieldId}" class="block-builder-form-label">
          ${field.label} ${required ? '<span class="required">*</span>' : ''}
        </label>
        <select id="${fieldId}" name="${field.field}" class="block-builder-form-control" ${required}>
          <option value="">Выберите...</option>
          ${field.options?.map(option =>
            `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`
          ).join('') || ''}
        </select>
      </div>
    `;
  }

  /**
   * Генерация number поля
   */
  private generateNumberHTML(fieldId: string, field: IFieldConfig, value: any, required: string): string {
    return `
      <div class="block-builder-form-group">
        <label for="${fieldId}" class="block-builder-form-label">
          ${field.label} ${required ? '<span class="required">*</span>' : ''}
        </label>
        <input
          type="number"
          id="${fieldId}"
          name="${field.field}"
          class="block-builder-form-control"
          placeholder="${field.placeholder || ''}"
          value="${value || ''}"
          ${required}
        />
      </div>
    `;
  }

  /**
   * Генерация color поля
   */
  private generateColorHTML(fieldId: string, field: IFieldConfig, value: any, required: string): string {
    return `
      <div class="block-builder-form-group">
        <label for="${fieldId}" class="block-builder-form-label">
          ${field.label} ${required ? '<span class="required">*</span>' : ''}
        </label>
        <input
          type="color"
          id="${fieldId}"
          name="${field.field}"
          class="block-builder-form-control"
          value="${value || '#333333'}"
          ${required}
        />
      </div>
    `;
  }

  /**
   * Генерация URL поля
   */
  private generateUrlHTML(fieldId: string, field: IFieldConfig, value: any, required: string): string {
    return `
      <div class="block-builder-form-group">
        <label for="${fieldId}" class="block-builder-form-label">
          ${field.label} ${required ? '<span class="required">*</span>' : ''}
        </label>
        <input
          type="url"
          id="${fieldId}"
          name="${field.field}"
          class="block-builder-form-control"
          placeholder="${field.placeholder || ''}"
          value="${value || ''}"
          ${required}
        />
      </div>
    `;
  }

  /**
   * Генерация checkbox поля
   */
  private generateCheckboxHTML(fieldId: string, field: IFieldConfig, value: any): string {
    return `
      <div class="block-builder-form-group">
        <label class="block-builder-form-checkbox">
          <input
            type="checkbox"
            id="${fieldId}"
            name="${field.field}"
            class="block-builder-form-checkbox-input"
            ${value ? 'checked' : ''}
          />
          <span class="block-builder-form-checkbox-label">${field.label}</span>
        </label>
      </div>
    `;
  }

  /**
   * Генерация text поля
   */
  private generateTextHTML(fieldId: string, field: IFieldConfig, value: any, required: string): string {
    return `
      <div class="block-builder-form-group">
        <label for="${fieldId}" class="block-builder-form-label">
          ${field.label} ${required ? '<span class="required">*</span>' : ''}
        </label>
        <input
          type="text"
          id="${fieldId}"
          name="${field.field}"
          class="block-builder-form-control"
          placeholder="${field.placeholder || ''}"
          value="${value || ''}"
          ${required}
        />
      </div>
    `;
  }

  /**
   * Валидация формы
   */
  validateForm(props: Record<string, any>, fields: IFieldConfig[]): { valid: boolean; message?: string } {
    for (const field of fields) {
      const value = props[field.field];
      const rules = field.rules || [];

      for (const rule of rules) {
        // Required валидация
        if (rule.type === 'required' && (!value || value.toString().trim() === '')) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }

        // Email валидация
        if (rule.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }

        // URL валидация
        if (rule.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }

        // Min валидация
        if (rule.type === 'min' && value && Number(value) < rule.value!) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }

        // Max валидация
        if (rule.type === 'max' && value && Number(value) > rule.value!) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }

        // MinLength валидация
        if (rule.type === 'minLength' && value && value.length < rule.value!) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }

        // MaxLength валидация
        if (rule.type === 'maxLength' && value && value.length > rule.value!) {
          return {
            valid: false,
            message: `${field.label}: ${rule.message}`
          };
        }
      }
    }

    return { valid: true };
  }
}

