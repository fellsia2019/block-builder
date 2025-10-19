/**
 * Система валидации для блоков
 * Поддерживает как Vue3 (vuelidate), так и чистый JavaScript
 */

export type ValidationRuleType = 
  | 'required'
  | 'email'
  | 'url'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom';

export interface BaseValidationRule {
  type: ValidationRuleType;
  message: string;
  field: string;
}

export interface RequiredRule extends BaseValidationRule {
  type: 'required';
}

export interface EmailRule extends BaseValidationRule {
  type: 'email';
}

export interface UrlRule extends BaseValidationRule {
  type: 'url';
}

export interface MinRule extends BaseValidationRule {
  type: 'min';
  value: number;
}

export interface MaxRule extends BaseValidationRule {
  type: 'max';
  value: number;
}

export interface MinLengthRule extends BaseValidationRule {
  type: 'minLength';
  value: number;
}

export interface MaxLengthRule extends BaseValidationRule {
  type: 'maxLength';
  value: number;
}

export interface PatternRule extends BaseValidationRule {
  type: 'pattern';
  value: RegExp;
}

export interface CustomRule extends BaseValidationRule {
  type: 'custom';
  validator: (value: any) => boolean | Promise<boolean>;
}

export type ValidationRule = 
  | RequiredRule
  | EmailRule
  | UrlRule
  | MinRule
  | MaxRule
  | MinLengthRule
  | MaxLengthRule
  | PatternRule
  | CustomRule;

export interface FieldValidationConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'color' | 'file';
  placeholder?: string;
  options?: Array<{ value: any; label: string }>; // Для select
  rules: ValidationRule[];
  defaultValue?: any;
}

export interface FormGenerationConfig {
  title: string;
  description?: string;
  fields: FieldValidationConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface FormData {
  [key: string]: any;
}
