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

// Core - Entities
export * from './core/entities/Block';
export * from './core/entities/ValidationRule';

// Core - Ports (интерфейсы)
export * from './core/ports/BlockRepository';
export * from './core/ports/ComponentRegistry';

// Core - Use Cases (единственный вход в ядро)
export * from './core/use-cases/CreateBlockUseCase';
export * from './core/use-cases/UpdateBlockUseCase';
export * from './core/use-cases/DeleteBlockUseCase';
export * from './core/use-cases/MoveBlockUseCase';
export * from './core/use-cases/DuplicateBlockUseCase';
export * from './core/use-cases/BlockManagementUseCase';
export * from './core/use-cases/ComponentManagementUseCase';
export * from './core/use-cases/FormGenerationUseCase';

// Infrastructure - Реализации портов
export * from './infrastructure/repositories/MemoryBlockRepositoryImpl';
export * from './infrastructure/repositories/LocalStorageBlockRepositoryImpl';
export * from './infrastructure/registries/MemoryComponentRegistry';

// UI компоненты (только для Vue3 проектов)
// export { default as BlockBuilder } from './ui/components/BlockBuilder.vue';
// export { default as BlockComponent } from './ui/components/BlockComponent.vue';
// export { default as BlockProperties } from './ui/components/BlockProperties.vue';

// Универсальная валидация (избегаем конфликтов имен)
export type { ValidationRuleType as UV_ValidationRuleType, ValidationRule as UV_ValidationRule, FormGenerationConfig as UV_FormGenerationConfig, ValidationResult as UV_ValidationResult, FormData as UV_FormData } from './utils/universalValidation';
export { UniversalValidator as UV_UniversalValidator, FormUtils as UV_FormUtils, BlockFormConfigs as UV_BlockFormConfigs } from './utils/universalValidation';

// Утилиты (избегаем конфликтов имен с Block entity)
export type { Block as UtilsBlock, BlockId as UtilsBlockId, BlockPosition as UtilsBlockPosition, BlockSize as UtilsBlockSize } from './utils/blockHelpers';
export { buildBlockHierarchy, cloneBlock, constrainBlockToBounds, doBlocksIntersect, findIntersectingBlocks, findNearestBlock, getAllChildren, getDistanceBetweenBlocks, isBlockInBounds, isChildOf, isPointInBlock, snapToGrid } from './utils/blockHelpers';

// Экспорт генератора/валидатора форм под уникальными именами
export { JavaScriptValidator as UtilsJavaScriptValidator, JavaScriptFormGenerator as UtilsJavaScriptFormGenerator } from './utils/validation';