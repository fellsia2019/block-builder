/**
 * Система валидации для блоков
 * Поддерживает как Vue3 (vuelidate), так и чистый JavaScript
 */

export type TValidationRuleType = 
  | 'required'
  | 'email'
  | 'url'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'custom';

export interface IBaseValidationRule {
  type: TValidationRuleType;
  message: string;
  field: string;
}

export interface IRequiredRule extends IBaseValidationRule {
  type: 'required';
}

export interface IEmailRule extends IBaseValidationRule {
  type: 'email';
}

export interface IUrlRule extends IBaseValidationRule {
  type: 'url';
}

export interface IMinRule extends IBaseValidationRule {
  type: 'min';
  value: number;
}

export interface IMaxRule extends IBaseValidationRule {
  type: 'max';
  value: number;
}

export interface IMinLengthRule extends IBaseValidationRule {
  type: 'minLength';
  value: number;
}

export interface IMaxLengthRule extends IBaseValidationRule {
  type: 'maxLength';
  value: number;
}

export interface IPatternRule extends IBaseValidationRule {
  type: 'pattern';
  value: RegExp;
}

export interface ICustomRule extends IBaseValidationRule {
  type: 'custom';
  validator: (value: any) => boolean | Promise<boolean>;
}

export type TValidationRule = 
  | IRequiredRule
  | IEmailRule
  | IUrlRule
  | IMinRule
  | IMaxRule
  | IMinLengthRule
  | IMaxLengthRule
  | IPatternRule
  | ICustomRule;

export interface IFieldValidationConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'color' | 'file';
  placeholder?: string;
  options?: Array<{ value: any; label: string }>; // Для select
  rules: TValidationRule[];
  defaultValue?: any;
}

export interface IFormGenerationConfig {
  title: string;
  description?: string;
  fields: IFieldValidationConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface IFormData {
  [key: string]: any;
}
