/**
 * Naberika - Блочный конструктор для no-code разработки
 *
 * Правильная чистая архитектура:
 * - Core: сущности, use cases, порты, DTO
 * - Infrastructure: реализации портов
 * - UI: только вызывает use cases
 */

// Core - DTO
export * from './core/dto/BlockDto';

// Core - Types
export type {
  IFormFieldConfig,
  IFieldValidationConfig,
  IFormGenerationConfig,
  TFieldType,
  IApiSelectConfig,
  IApiSelectItem,
  IApiSelectResponse,
  IApiRequestParams,
  THttpMethod
} from './core/types/form';
export type { IValidationRule, TValidationRuleType, IValidationResult } from './core/types/validation';

// Core - Entities
export * from './core/entities/Block';

// Core - Ports (интерфейсы)
export * from './core/ports/BlockRepository';
export * from './core/ports/ComponentRegistry';
export type { IHttpClient, IHttpResponse, IHttpError, IHttpRequestOptions } from './core/ports/HttpClient';

// Core - Use Cases (единственный вход в ядро)
export * from './core/use-cases/CreateBlockUseCase';
export * from './core/use-cases/UpdateBlockUseCase';
export * from './core/use-cases/DeleteBlockUseCase';
export * from './core/use-cases/DuplicateBlockUseCase';
export * from './core/use-cases/BlockManagementUseCase';
export * from './core/use-cases/ComponentManagementUseCase';
export * from './core/use-cases/ApiSelectUseCase';

// Main API (главный класс пакета) - применен паттерн Facade
// Facade находится вне core/, так как связывает все слои (core, infrastructure, ui)
export { BlockBuilderFacade as BlockBuilder } from './BlockBuilderFacade';
export type { IBlockBuilderOptions } from './BlockBuilderFacade';

// UI Services (для расширенного использования)
export { StyleManager } from './ui/services/StyleManager';
export { FormBuilder } from './ui/services/FormBuilder';
export { ModalManager } from './ui/services/ModalManager';
export { UIRenderer } from './ui/services/UIRenderer';
export { BlockUIController } from './ui/controllers/BlockUIController';
export { SpacingControlRenderer } from './ui/services/SpacingControlRenderer';
export type { ISpacingControlOptions } from './ui/services/SpacingControlRenderer';
export { ApiSelectControlRenderer } from './ui/services/ApiSelectControlRenderer';
export type { IApiSelectControlOptions } from './ui/services/ApiSelectControlRenderer';

// UI Types
export type { TFieldConfig } from './ui/services/FormBuilder';
export type { IModalOptions } from './ui/services/ModalManager';
export type { IUIRendererConfig } from './ui/services/UIRenderer';
export type { IBlockUIControllerConfig } from './ui/controllers/BlockUIController';

// Infrastructure - Реализации портов
export * from './infrastructure/repositories/MemoryBlockRepositoryImpl';
export * from './infrastructure/repositories/LocalStorageBlockRepositoryImpl';
export * from './infrastructure/registries/MemoryComponentRegistry';
export { FetchHttpClient } from './infrastructure/http/FetchHttpClient';

// UI компоненты (только для Vue3 проектов)
// export { default as BlockBuilder } from './ui/components/BlockBuilder.vue';
// export { default as BlockComponent } from './ui/components/BlockComponent.vue';
// export { default as BlockProperties } from './ui/components/BlockProperties.vue';

// Универсальная валидация (избегаем конфликтов имен)
export type { TValidationRuleType as UV_ValidationRuleType, IValidationRule as UV_ValidationRule, IFormGenerationConfig as UV_FormGenerationConfig, IValidationResult as UV_ValidationResult, IFormData as UV_FormData } from './utils/universalValidation';
export { UniversalValidator as UV_UniversalValidator, FormUtils as UV_FormUtils, BlockFormConfigs as UV_BlockFormConfigs } from './utils/universalValidation';

// Утилиты (избегаем конфликтов имен с Block entity)
export type { TBlock as UtilsBlock, TBlockId as UtilsBlockId } from './utils/blockHelpers';
export { buildBlockHierarchy, cloneBlock, getAllChildren, isChildOf } from './utils/blockHelpers';

// Экспорт генератора/валидатора форм под уникальными именами
export { JavaScriptValidator as UtilsJavaScriptValidator, JavaScriptFormGenerator as UtilsJavaScriptFormGenerator } from './utils/validation';

// Утилита для копирования в буфер обмена
export { copyToClipboard } from './utils/copyToClipboard';

// Утилиты для работы со spacing
export * from './utils/spacingHelpers';
export * from './utils/blockSpacingHelpers';
export * from './utils/breakpointHelpers';

// Утилиты для работы с ошибками валидации форм
export * from './utils/formErrorHelpers';
