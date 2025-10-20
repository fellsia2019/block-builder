/**
 * Система валидации для блоков
 * Поддерживает как Vue3 (vuelidate), так и чистый JavaScript
 */

// Реэкспорт для обратной совместимости
export type {
  TValidationRuleType,
  IBaseValidationRule,
  IRequiredRule,
  IEmailRule,
  IUrlRule,
  IMinRule,
  IMaxRule,
  IMinLengthRule,
  IMaxLengthRule,
  IPatternRule,
  ICustomRule,
  TValidationRule,
  IFieldValidationConfig,
  IFormGenerationConfig,
  IValidationResult,
  IFormData
} from '../types';
