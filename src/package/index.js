/**
 * Пакет (ядро) — экспортирует API ядра и инфраструктуры.
 * UI демо находится в src/ui/demo и не является частью пакета.
 */

export * from '../core/dto/BlockDto';
export * from '../core/entities/Block';
export * from '../core/entities/ValidationRule';
export * from '../core/ports/BlockRepository';
export * from '../core/ports/ComponentRegistry';
export * from '../core/use-cases/CreateBlockUseCase';
export * from '../core/use-cases/UpdateBlockUseCase';
export * from '../core/use-cases/DeleteBlockUseCase';
export * from '../core/use-cases/MoveBlockUseCase';
export * from '../core/use-cases/DuplicateBlockUseCase';
export * from '../core/use-cases/BlockManagementUseCase';
export * from '../core/use-cases/ComponentManagementUseCase';
export * from '../core/use-cases/FormGenerationUseCase';
export * from '../infrastructure/repositories/MemoryBlockRepositoryImpl';
export * from '../infrastructure/repositories/LocalStorageBlockRepositoryImpl';
export * from '../infrastructure/registries/MemoryComponentRegistry';
export * from '../utils/universalValidation';
export * from '../utils/blockHelpers';
export * from '../utils/validation';

