/**
 * BlockBuilderFacade - фасад для работы с блочным конструктором
 * Применяем паттерн Facade для упрощения API
 * Принцип единой ответственности (SRP) - только делегирование вызовов
 * 
 * ВАЖНО: Этот класс находится вне core/, так как он связывает все слои
 * (core, infrastructure, ui) и не является частью чистой бизнес-логики
 */

import { IBlockDto, ICreateBlockDto, IUpdateBlockDto } from './core/types';
import { IBlockRepository } from './core/ports/BlockRepository';
import { IComponentRegistry } from './core/ports/ComponentRegistry';
import { BlockManagementUseCase } from './core/use-cases/BlockManagementUseCase';
import { MemoryBlockRepositoryImpl } from './infrastructure/repositories/MemoryBlockRepositoryImpl';
import { LocalStorageBlockRepositoryImpl } from './infrastructure/repositories/LocalStorageBlockRepositoryImpl';
import { MemoryComponentRegistry } from './infrastructure/registries/MemoryComponentRegistry';
import { BlockUIController } from './ui/controllers/BlockUIController';

export interface IBlockBuilderOptions {
    containerId: string;
    blockConfigs: Record<string, any>;
    repository?: IBlockRepository;
    componentRegistry?: IComponentRegistry;
    theme?: 'light' | 'dark';
    locale?: string;
    storage?: 'memory' | 'localStorage';
    autoRender?: boolean;
}

/**
 * BlockBuilderFacade - главный класс библиотеки
 * Единственная точка входа для пользователей пакета
 */
export class BlockBuilderFacade {
    private useCase: BlockManagementUseCase;
    private repository: IBlockRepository;
    private componentRegistry: IComponentRegistry;
    private blockConfigs: Record<string, any>;
    private uiController?: BlockUIController;

    // Публичные настройки
    public readonly theme: string;
    public readonly locale: string;

    constructor(options: IBlockBuilderOptions) {
        this.blockConfigs = options.blockConfigs;
        this.theme = options.theme || 'light';
        this.locale = options.locale || 'ru';

        // Инициализация репозитория (применяем Strategy pattern через опции)
        this.repository = options.repository || this.createDefaultRepository(options.storage);

        // Инициализация реестра компонентов
        this.componentRegistry = options.componentRegistry || new MemoryComponentRegistry();

        // Создание главного Use Case (DIP - зависим от абстракций)
        this.useCase = new BlockManagementUseCase(this.repository, this.componentRegistry);

        // Регистрация компонентов из конфигурации
        this.registerComponentsFromConfig();

        // Автоматический рендеринг UI (если требуется)
        if (options.autoRender !== false && options.containerId) {
            this.initUI(options.containerId);
        }
    }

    /**
     * Инициализация UI контроллера
     */
    private async initUI(containerId: string): Promise<void> {
        this.uiController = new BlockUIController({
            containerId,
            blockConfigs: this.blockConfigs,
            useCase: this.useCase
        });

        await this.uiController.init();

        // Делаем доступным глобально для onclick обработчиков
        (window as any).blockBuilder = this;
    }

    /**
     * Создает репозиторий по умолчанию (применяем Factory pattern)
     */
    private createDefaultRepository(storage?: string): IBlockRepository {
        switch (storage) {
            case 'localStorage':
                return new LocalStorageBlockRepositoryImpl();
            case 'memory':
            default:
                return new MemoryBlockRepositoryImpl();
        }
    }

    /**
     * Регистрирует компоненты из конфигурации блоков
     */
    private registerComponentsFromConfig(): void {
        const components: Record<string, any> = {};

        Object.entries(this.blockConfigs).forEach(([type, config]) => {
            if (config.render?.kind === 'component' && config.render?.component) {
                const componentName = config.render.component.name || type;
                components[componentName] = config.render.component;
            }
        });

        if (Object.keys(components).length > 0) {
            this.useCase.registerComponents(components);
        }
    }

    // ===== ПУБЛИЧНЫЙ API ДЛЯ РАБОТЫ С БЛОКАМИ =====

    /**
     * Создание блока
     */
    async createBlock(blockData: ICreateBlockDto): Promise<IBlockDto> {
        return this.useCase.createBlock(blockData);
    }

    /**
     * Получение блока по ID
     */
    async getBlock(blockId: string): Promise<IBlockDto | null> {
        return this.useCase.getBlock(blockId);
    }

    /**
     * Получение всех блоков
     */
    async getAllBlocks(): Promise<IBlockDto[]> {
        return this.useCase.getAllBlocks();
    }

    /**
     * Обновление блока
     */
    async updateBlock(blockId: string, updates: IUpdateBlockDto): Promise<IBlockDto | null> {
        return this.useCase.updateBlock(blockId, updates);
    }

    /**
     * Удаление блока
     */
    async deleteBlock(blockId: string): Promise<boolean> {
        return this.useCase.deleteBlock(blockId);
    }

    /**
     * Дублирование блока
     */
    async duplicateBlock(blockId: string): Promise<IBlockDto | null> {
        return this.useCase.duplicateBlock(blockId);
    }

    /**
     * Блокировка/разблокировка блока
     */
    async setBlockLocked(blockId: string, locked: boolean): Promise<IBlockDto | null> {
        return this.useCase.setBlockLocked(blockId, locked);
    }

    /**
     * Показ/скрытие блока
     */
    async setBlockVisible(blockId: string, visible: boolean): Promise<IBlockDto | null> {
        return this.useCase.setBlockVisible(blockId, visible);
    }

    /**
     * Получение блоков по типу
     */
    async getBlocksByType(type: string): Promise<IBlockDto[]> {
        return this.useCase.getBlocksByType(type);
    }

    /**
     * Переупорядочивание блоков
     */
    async reorderBlocks(blockIds: string[]): Promise<boolean> {
        return this.useCase.reorderBlocks(blockIds);
    }

    // ===== ПУБЛИЧНЫЙ API ДЛЯ РАБОТЫ С КОМПОНЕНТАМИ =====

    /**
     * Регистрация компонента
     */
    registerComponent(name: string, component: any): void {
        this.useCase.registerComponent(name, component);
    }

    /**
     * Получение компонента
     */
    getComponent(name: string): any | null {
        return this.useCase.getComponent(name);
    }

    /**
     * Проверка существования компонента
     */
    hasComponent(name: string): boolean {
        return this.useCase.hasComponent(name);
    }

    /**
     * Получение всех компонентов
     */
    getAllComponents(): Record<string, any> {
        return this.useCase.getAllComponents();
    }

    /**
     * Удаление компонента
     */
    unregisterComponent(name: string): boolean {
        return this.useCase.unregisterComponent(name);
    }

    /**
     * Массовая регистрация компонентов
     */
    registerComponents(components: Record<string, any>): void {
        this.useCase.registerComponents(components);
    }

    // ===== ПУБЛИЧНЫЙ API ДЛЯ VUE3 =====

    /**
     * Создание Vue3 блока
     */
    async createVueBlock(
        type: string,
        componentName: string,
        componentProps: Record<string, any> = {},
        settings: Record<string, any> = {}
    ): Promise<IBlockDto> {
        return this.useCase.createVueBlock(type, componentName, componentProps, settings);
    }

    /**
     * Обновление Vue3 компонента блока
     */
    async updateVueComponent(
        blockId: string,
        componentName: string,
        componentProps: Record<string, any>
    ): Promise<IBlockDto | null> {
        return this.useCase.updateVueComponent(blockId, componentName, componentProps);
    }

    // ===== УТИЛИТЫ =====

    /**
     * Получение конфигурации блоков
     */
    getBlockConfigs(): Record<string, any> {
        return { ...this.blockConfigs };
    }

    /**
     * Получение конфигурации конкретного блока
     */
    getBlockConfig(type: string): any {
        return this.blockConfigs[type];
    }

    /**
     * Проверка существования типа блока
     */
    hasBlockType(type: string): boolean {
        return type in this.blockConfigs;
    }

    /**
     * Получение списка доступных типов блоков
     */
    getAvailableBlockTypes(): string[] {
        return Object.keys(this.blockConfigs);
    }

    /**
     * Очистка всех блоков
     */
    async clearAllBlocks(): Promise<void> {
        return this.repository.clear();
    }

    /**
     * Получение количества блоков
     */
    async getBlocksCount(): Promise<number> {
        return this.repository.count();
    }

    /**
     * Экспорт блоков в JSON
     */
    async exportBlocks(): Promise<string> {
        const blocks = await this.getAllBlocks();
        return JSON.stringify(blocks, null, 2);
    }

    /**
     * Импорт блоков из JSON
     */
    async importBlocks(jsonData: string): Promise<boolean> {
        try {
            const blocks = JSON.parse(jsonData);
            if (!Array.isArray(blocks)) return false;

            await this.clearAllBlocks();

            for (const block of blocks) {
                await this.createBlock(block);
            }

            return true;
        } catch (error) {
            console.error('Error importing blocks:', error);
            return false;
        }
    }

    // ===== UI МЕТОДЫ (делегируем UI контроллеру) =====

    /**
     * Показать модалку выбора типа блока
     */
    showBlockTypeSelectionModal(position?: number): void {
        this.uiController?.showBlockTypeSelectionModal(position);
    }

    /**
     * Показать форму добавления блока на определенной позиции
     */
    showAddBlockFormAtPosition(type: string, position?: number): void {
        this.uiController?.showAddBlockFormAtPosition(type, position);
    }

    /**
     * Показать форму добавления блока
     */
    showAddBlockForm(type: string): void {
        this.uiController?.showAddBlockForm(type);
    }

    /**
     * Редактирование блока
     */
    editBlock(blockId: string): void {
        this.uiController?.editBlock(blockId);
    }

    /**
     * Переключение блокировки блока
     */
    async toggleBlockLock(blockId: string): Promise<void> {
        await this.uiController?.toggleBlockLock(blockId);
    }

    /**
     * Переключение видимости блока
     */
    async toggleBlockVisibility(blockId: string): Promise<void> {
        await this.uiController?.toggleBlockVisibility(blockId);
    }

    /**
     * UI: Удаление блока
     */
    async deleteBlockUI(blockId: string): Promise<void> {
        await this.uiController?.deleteBlockUI(blockId);
    }

    /**
     * UI: Дублирование блока
     */
    async duplicateBlockUI(blockId: string): Promise<void> {
        await this.uiController?.duplicateBlockUI(blockId);
    }

    /**
     * UI: Очистка всех блоков
     */
    async clearAllBlocksUI(): Promise<void> {
        await this.uiController?.clearAllBlocksUI();
    }

    /**
     * Перемещение блока вверх
     */
    async moveBlockUp(blockId: string): Promise<void> {
        await this.uiController?.moveBlockUp(blockId);
    }

    /**
     * Перемещение блока вниз
     */
    async moveBlockDown(blockId: string): Promise<void> {
        await this.uiController?.moveBlockDown(blockId);
    }

    /**
     * Копирование ID блока в буфер обмена
     */
    copyBlockId(blockId: string): void {
        this.uiController?.copyBlockId(blockId);
    }

    /**
     * Закрытие модального окна
     */
    closeModal(): void {
        this.uiController?.closeModal();
    }

    /**
     * Submit модального окна
     */
    submitModal(): void {
        this.uiController?.submitModal();
    }

    /**
     * Очистка ресурсов
     */
    destroy(): void {
        this.uiController?.destroy();
        delete (window as any).blockBuilder;
    }
}

