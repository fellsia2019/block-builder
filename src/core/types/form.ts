/**
 * Типы для работы с формами
 */

import { IValidationRule } from './validation';

// Типы полей форм
export type TFieldType = 'text' | 'number' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'color' | 'file' | 'spacing';

// Типы отступов
export type TSpacingType = 'padding-top' | 'padding-bottom' | 'margin-top' | 'margin-bottom';

// Брекпоинты для адаптивности
export interface IBreakpoint {
  name: string;
  maxWidth?: number; // undefined для desktop (default)
  label: string;
}

// Значение отступа для конкретного брекпоинта
export interface ISpacingValue {
  [breakpoint: string]: number; // Ключ - название брекпоинта, значение - размер в пикселях
}

// Конфигурация для spacing поля
export interface ISpacingFieldConfig {
  spacingTypes?: TSpacingType[]; // Какие типы отступов доступны
  min?: number; // Минимальное значение (по умолчанию 0)
  max?: number; // Максимальное значение (по умолчанию 200)
  step?: number; // Шаг изменения (по умолчанию 1)
  breakpoints?: IBreakpoint[]; // Кастомные брекпоинты (если не указаны, используются базовые)
}

// Опции для автоматического spacing в блоках
export interface IBlockSpacingOptions {
  enabled?: boolean; // Включить/выключить spacing для блока (по умолчанию true)
  spacingTypes?: TSpacingType[]; // Конкретные типы отступов (по умолчанию все 4)
  config?: Omit<ISpacingFieldConfig, 'spacingTypes'>; // Дополнительная конфигурация
}

// Конфигурация поля формы
export interface IFormFieldConfig {
  field: string;
  label: string;
  type: TFieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: { value: string; label: string }[]; // Для типа 'select'
  rules?: IValidationRule[];
  spacingConfig?: ISpacingFieldConfig; // Для типа 'spacing'
}

// Конфигурация блока с опциями spacing
export interface IBlockConfigWithSpacing {
  title?: string;
  icon?: string;
  description?: string;
  fields?: IFormFieldConfig[];
  spacingOptions?: IBlockSpacingOptions; // Опции для автоматического добавления spacing
  [key: string]: any;
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
