/**
 * Типы для работы с формами
 */

import { IValidationRule } from './validation';

// Типы полей форм
export type TFieldType = 'text' | 'number' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'color' | 'file';

// Конфигурация поля формы
export interface IFormFieldConfig {
  field: string;
  label: string;
  type: TFieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: { value: string; label: string }[]; // Для типа 'select'
  rules?: IValidationRule[];
}

// Конфигурация поля с расширенной валидацией
export interface IFieldValidationConfig {
  field: string;
  label: string;
  type: TFieldType;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>; // Для select
  rules: IValidationRule[];
  defaultValue?: any;
}

// Конфигурация для генерации форм
export interface IFormGenerationConfig {
  title: string;
  description?: string;
  fields: IFormFieldConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
}
