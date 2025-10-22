/**
 * Vue3 компоненты для BlockBuilder
 * Используйте этот модуль если работаете с Vue3
 */

// Vue компоненты
export { default as BlockBuilderComponent } from './ui/components/BlockBuilder.vue'
export { default as BlockComponent } from './ui/components/BlockComponent.vue'
export { default as BlockProperties } from './ui/components/BlockProperties.vue'

// Core для использования в Vue компонентах
export * from './core/use-cases/BlockManagementUseCase'
export * from './core/use-cases/ComponentManagementUseCase'
export * from './infrastructure/repositories/MemoryBlockRepositoryImpl'
export * from './infrastructure/repositories/LocalStorageBlockRepositoryImpl'
export * from './infrastructure/registries/MemoryComponentRegistry'

// Типы
export type * from './core/types'

