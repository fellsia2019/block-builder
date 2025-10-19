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

// Core - Ports (интерфейсы)
export * from './core/ports/BlockRepository';

// Core - Use Cases (единственный вход в ядро)
export * from './core/use-cases/CreateBlockUseCase';
export * from './core/use-cases/UpdateBlockUseCase';
export * from './core/use-cases/DeleteBlockUseCase';
export * from './core/use-cases/MoveBlockUseCase';
export * from './core/use-cases/DuplicateBlockUseCase';
export * from './core/use-cases/BlockManagementUseCase';

// Infrastructure - Реализации портов
export * from './infrastructure/repositories/MemoryBlockRepositoryImpl';
export * from './infrastructure/repositories/LocalStorageBlockRepositoryImpl';

// UI компоненты (только для Vue3 проектов)
// export { default as BlockBuilder } from './ui/components/BlockBuilder.vue';
// export { default as BlockComponent } from './ui/components/BlockComponent.vue';
// export { default as BlockProperties } from './ui/components/BlockProperties.vue';

// Утилиты
export * from './utils/blockHelpers';
export * from './utils/validation';