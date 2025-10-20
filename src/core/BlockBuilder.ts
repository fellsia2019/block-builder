/**
 * BlockBuilder - Основной класс пакета
 * Предоставляет высокоуровневый API для работы с блочным конструктором
 */

import { IBlockDto, ICreateBlockDto, IUpdateBlockDto } from './types';
import { IBlockRepository } from './ports/BlockRepository';
import { IComponentRegistry } from './ports/ComponentRegistry';
import { BlockManagementUseCase } from './use-cases/BlockManagementUseCase';
import { MemoryBlockRepositoryImpl } from '../infrastructure/repositories/MemoryBlockRepositoryImpl';
import { LocalStorageBlockRepositoryImpl } from '../infrastructure/repositories/LocalStorageBlockRepositoryImpl';
import { MemoryComponentRegistry } from '../infrastructure/registries/MemoryComponentRegistry';

export interface IBlockBuilderOptions {
  containerId: string;
  blockConfigs: Record<string, any>;
  repository?: IBlockRepository;
  componentRegistry?: IComponentRegistry;
  theme?: 'light' | 'dark';
  locale?: string;
  storage?: 'memory' | 'localStorage';
  autoRender?: boolean; // Автоматически рендерить UI
}

/**
 * Основной класс BlockBuilder
 * Единственная точка входа для пользователей пакета
 */
export class BlockBuilder {
  private useCase: BlockManagementUseCase;
  private repository: IBlockRepository;
  private componentRegistry: IComponentRegistry;
  private blockConfigs: Record<string, any>;
  private containerId: string;
  private theme: string;
  private locale: string;
  private autoRender: boolean;
  private blocks: IBlockDto[] = [];

  constructor(options: IBlockBuilderOptions) {
    this.containerId = options.containerId;
    this.blockConfigs = options.blockConfigs;
    this.theme = options.theme || 'light';
    this.locale = options.locale || 'ru';
    this.autoRender = options.autoRender !== false; // По умолчанию true

    // Инициализация репозитория
    this.repository = options.repository || this.createDefaultRepository(options.storage);

    // Инициализация реестра компонентов
    this.componentRegistry = options.componentRegistry || new MemoryComponentRegistry();

    // Создание главного Use Case
    this.useCase = new BlockManagementUseCase(this.repository, this.componentRegistry);

    // Регистрация компонентов из конфигурации
    this.registerComponentsFromConfig();

    // Автоматический рендеринг UI
    if (this.autoRender) {
      this.init();
    }
  }

  /**
   * Создает репозиторий по умолчанию
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
        // Регистрируем компонент по его имени, а не по типу блока
        const componentName = config.render.component.name || type;
        components[componentName] = config.render.component;
      }
    });

    if (Object.keys(components).length > 0) {
      this.useCase.registerComponents(components);
    }
  }

  // ===== ПУБЛИЧНЫЙ API ДЛЯ ПОЛЬЗОВАТЕЛЕЙ =====

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

  // ===== МЕТОДЫ ДЛЯ РАБОТЫ С КОМПОНЕНТАМИ =====

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

  // ===== МЕТОДЫ ДЛЯ РАБОТЫ С VUE3 =====

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

      // Очищаем текущие блоки
      await this.clearAllBlocks();

      // Импортируем новые блоки
      for (const block of blocks) {
        await this.createBlock(block);
      }

      return true;
    } catch (error) {
      console.error('Error importing blocks:', error);
      return false;
    }
  }

  // ===== UI МЕТОДЫ =====

  /**
   * Инициализация UI
   */
  private async init(): Promise<void> {
    this.renderUI();
    await this.fetchBlocks();
    this.renderBlocks();
  }

  /**
   * Рендеринг основного UI
   */
  private renderUI(): void {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn(`Container with id "${this.containerId}" not found`);
      return;
    }

    container.innerHTML = `
      <div class="block-builder-app">
        <div class="block-builder-controls">
          ${Object.keys(this.blockConfigs).map(type => {
            const config = this.blockConfigs[type];
            return `
              <button onclick="blockBuilder.showAddBlockForm('${type}')" class="block-builder-btn block-builder-btn-primary">
                📝 Добавить ${config.title}
              </button>
            `;
          }).join('')}
          <button onclick="blockBuilder.clearAllBlocksUI()" class="block-builder-btn block-builder-btn-danger">🗑️ Очистить все</button>
        </div>
        <div class="block-builder-stats">
          <p>Всего блоков: <span id="blocks-count">0</span></p>
        </div>
        <div class="block-builder-blocks" id="block-builder-blocks"></div>
      </div>
    `;

    this.addStyles();

    // Делаем экземпляр доступным глобально для onclick
    (window as any).blockBuilder = this;
  }

  /**
   * Загрузка блоков из репозитория
   */
  private async fetchBlocks(): Promise<void> {
    this.blocks = await this.useCase.getAllBlocks();
  }

  /**
   * Рендеринг списка блоков
   */
  private async renderBlocks(): Promise<void> {
    const blocksContainer = document.getElementById('block-builder-blocks');
    const countElement = document.getElementById('blocks-count');

    if (!blocksContainer || !countElement) return;

    // Обновляем счетчик
    countElement.textContent = this.blocks.length.toString();

    if (this.blocks.length === 0) {
      blocksContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Блоков пока нет. Добавьте первый блок!</p>';
      return;
    }

    // Рендерим блоки
    blocksContainer.innerHTML = this.blocks.map(block => this.renderBlock(block)).join('');
  }

  /**
   * Рендеринг отдельного блока
   */
  private renderBlock(block: IBlockDto): string {
    const config = this.blockConfigs[block.type];
    if (!config) return '';

    const blockContent = this.renderBlockContent(block, config);

    return `
      <div class="block-builder-block ${block.locked ? 'locked' : ''} ${!block.visible ? 'hidden' : ''}" data-block-id="${block.id}">
        <div class="block-builder-block-header">
          <div class="block-builder-block-info">
            <span>📦 ${config.title}</span>
            <small>ID: ${block.id}</small>
            ${block.locked ? '<span class="locked-indicator">🔒</span>' : ''}
            ${!block.visible ? '<span class="hidden-indicator">👁️‍🗨️</span>' : ''}
          </div>
          <div class="block-builder-block-controls">
            <button onclick="blockBuilder.moveBlockUp('${block.id}')" class="block-builder-control-btn" title="Переместить вверх">⬆️</button>
            <button onclick="blockBuilder.moveBlockDown('${block.id}')" class="block-builder-control-btn" title="Переместить вниз">⬇️</button>
            <button onclick="blockBuilder.editBlock('${block.id}')" class="block-builder-control-btn" title="Редактировать">✏️</button>
            <button onclick="blockBuilder.duplicateBlockUI('${block.id}')" class="block-builder-control-btn" title="Дублировать">📋</button>
            <button onclick="blockBuilder.toggleBlockLock('${block.id}')" class="block-builder-control-btn" title="${block.locked ? 'Разблокировать' : 'Заблокировать'}">${block.locked ? '🔓' : '🔒'}</button>
            <button onclick="blockBuilder.toggleBlockVisibility('${block.id}')" class="block-builder-control-btn" title="${block.visible ? 'Скрыть' : 'Показать'}">${block.visible ? '👁️' : '👁️‍🗨️'}</button>
            <button onclick="blockBuilder.deleteBlockUI('${block.id}')" class="block-builder-control-btn" title="Удалить">🗑️</button>
          </div>
        </div>
        <div class="block-builder-block-content">
          ${blockContent}
        </div>
      </div>
    `;
  }

  /**
   * Рендеринг содержимого блока
   */
  private renderBlockContent(block: IBlockDto, config: any): string {
    // Если есть Vue компонент
    if (config.render?.kind === 'component' && config.render?.component) {
      return this.renderVueComponent(block, config);
    }

    // Если есть HTML шаблон
    if (config.template && typeof config.template === 'function') {
      return config.template(block.props);
    }

    // Если есть render.template
    if (config.render?.kind === 'html' && config.render?.template) {
      return config.render.template(block.props);
    }

    // Fallback - простое отображение
    return `
      <div class="block-content-fallback">
        <strong>${config.title}</strong>
        <pre>${JSON.stringify(block.props, null, 2)}</pre>
      </div>
    `;
  }

  /**
   * Рендеринг Vue компонента
   */
  private renderVueComponent(block: IBlockDto, config: any): string {
    const componentId = `vue-component-${block.id}`;
    const componentName = config.render.component.name;

    // Создаем контейнер для Vue компонента
    const containerHTML = `
      <div id="${componentId}" class="vue-component-container">
        <!-- Vue компонент будет монтирован здесь -->
      </div>
    `;

    // Монтируем Vue компонент асинхронно
    setTimeout(() => {
      this.mountVueComponent(componentId, componentName, block.props);
    }, 0);

    return containerHTML;
  }

  /**
   * Монтирование Vue компонента
   */
  private mountVueComponent(containerId: string, componentName: string, props: Record<string, any>): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Проверяем, что Vue доступен
    if (typeof (window as any).Vue === 'undefined') {
      container.innerHTML = `<div class="vue-error">Vue не найден. Убедитесь, что Vue загружен.</div>`;
      return;
    }

    // Получаем компонент из реестра
    const component = this.useCase.getComponent(componentName);
    if (!component) {
      container.innerHTML = `<div class="vue-error">Компонент ${componentName} не найден</div>`;
      return;
    }

    try {
      // Создаем Vue приложение с компонентом
      const app = (window as any).Vue.createApp({
        components: {
          [componentName]: component
        },
        template: `<${componentName} v-bind="props" />`,
        data() {
          return {
            props: props
          };
        }
      });

      // Монтируем приложение
      app.mount(container);
    } catch (error) {
      console.error('Ошибка монтирования Vue компонента:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      container.innerHTML = `<div class="vue-error">Ошибка рендеринга компонента: ${errorMessage}</div>`;
    }
  }

  /**
   * Добавление стилей
   */
  private addStyles(): void {
    if (document.getElementById('block-builder-styles')) return;

    const style = document.createElement('style');
    style.id = 'block-builder-styles';
    style.textContent = `
      .block-builder-app {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .block-builder-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }
      .block-builder-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
        text-align: center;
      }
      .block-builder-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .block-builder-btn-primary {
        background: #007bff;
        color: white;
      }
      .block-builder-btn-primary:hover {
        background: #0056b3;
      }
      .block-builder-btn-danger {
        background: #dc3545;
        color: white;
      }
      .block-builder-btn-danger:hover {
        background: #c82333;
      }
      .block-builder-stats {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        padding: 15px;
        background: #e9ecef;
        border-radius: 6px;
        font-size: 14px;
        color: #495057;
      }
      .block-builder-blocks {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .block-builder-block {
        border: 2px solid #007bff;
        border-radius: 8px;
        background: rgba(0, 123, 255, 0.05);
        margin-bottom: 20px;
        transition: all 0.3s ease;
        position: relative;
      }
      .block-builder-block:hover {
        background: rgba(0, 123, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
      }
      .block-builder-block.locked {
        border-color: #dc3545;
        background: rgba(220, 53, 69, 0.05);
      }
      .block-builder-block.hidden {
        opacity: 0.3;
      }
      .block-builder-block-header {
        background: rgba(0, 123, 255, 0.1);
        padding: 10px 15px;
        border-bottom: 1px solid #007bff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #2c3e50;
      }
      .block-builder-block-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .block-builder-block-controls {
        display: flex;
        gap: 5px;
      }
      .block-builder-control-btn {
        background: none;
        border: none;
        padding: 5px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      }
      .block-builder-control-btn:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      .block-builder-block-content {
        padding: 20px;
        min-height: 50px;
      }
      .locked-indicator, .hidden-indicator {
        font-size: 12px;
        margin-left: 5px;
      }
      .vue-component-container {
        min-height: 50px;
        padding: 10px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        background: #f8f9fa;
      }
      .vue-error {
        color: #dc3545;
        font-size: 12px;
        padding: 10px;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
      }
      .block-content-fallback {
        padding: 20px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
      }
      .block-content-fallback pre {
        margin: 10px 0 0 0;
        white-space: pre-wrap;
        word-break: break-all;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Добавление стилей для модального окна
   */
  private addModalStyles(): void {
    if (document.getElementById('block-builder-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'block-builder-modal-styles';
    style.textContent = `
      .block-builder-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .block-builder-modal-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .block-builder-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .block-builder-modal-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.25rem;
      }

      .block-builder-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }

      .block-builder-modal-close:hover {
        background: #f8f9fa;
        color: #333;
      }

      .block-builder-modal-body {
        padding: 20px;
      }

      .block-builder-modal-footer {
        padding: 20px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .block-builder-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .block-builder-form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .block-builder-form-label {
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      .block-builder-form-label .required {
        color: #dc3545;
        margin-left: 4px;
      }

      .block-builder-form-control {
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s ease;
        font-family: inherit;
      }

      .block-builder-form-control:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .block-builder-form-control:invalid {
        border-color: #dc3545;
      }

      .block-builder-form-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .block-builder-form-checkbox-input {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .block-builder-form-checkbox-label {
        font-size: 14px;
        color: #333;
        cursor: pointer;
      }

      textarea.block-builder-form-control {
        resize: vertical;
        min-height: 80px;
      }

      select.block-builder-form-control {
        cursor: pointer;
      }

      input[type="color"].block-builder-form-control {
        width: 60px;
        height: 40px;
        padding: 4px;
        cursor: pointer;
      }

      input[type="number"].block-builder-form-control {
        width: 120px;
      }

      input[type="url"].block-builder-form-control {
        font-family: monospace;
      }
    `;
    document.head.appendChild(style);
  }

  // ===== UI ОБРАБОТЧИКИ =====

  /**
   * Показать форму добавления блока
   */
  public showAddBlockForm(type: string): void {
    const config = this.blockConfigs[type];
    if (!config) {
      alert(`Конфигурация для типа "${type}" не найдена`);
      return;
    }

    // Создаем модальное окно с формой
    this.createModalForm(type, config);
  }

  /**
   * Создание модального окна с формой
   */
  private createModalForm(type: string, config: any): void {
    // Удаляем существующее модальное окно
    const existingModal = document.getElementById('block-builder-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const fields = config.fields || [];
    const formHTML = this.generateFormHTML(fields, config.title);

    const modalHTML = `
      <div id="block-builder-modal" class="block-builder-modal">
        <div class="block-builder-modal-content">
          <div class="block-builder-modal-header">
            <h3>Добавить ${config.title}</h3>
            <button onclick="blockBuilder.closeModal()" class="block-builder-modal-close">&times;</button>
          </div>
          <div class="block-builder-modal-body">
            <form id="block-builder-form" class="block-builder-form">
              ${formHTML}
            </form>
          </div>
          <div class="block-builder-modal-footer">
            <button onclick="blockBuilder.closeModal()" class="block-builder-btn block-builder-btn-secondary">Отмена</button>
            <button onclick="blockBuilder.submitForm('${type}')" class="block-builder-btn block-builder-btn-primary">Добавить</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.addModalStyles();
  }

  /**
   * Генерация HTML формы
   */
  private generateFormHTML(fields: any[], title: string): string {
    return fields.map(field => {
      const fieldId = `field-${field.field}`;
      const required = field.rules?.some((rule: any) => rule.type === 'required') ? 'required' : '';

      switch (field.type) {
        case 'textarea':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <textarea
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                ${required}
                rows="3"
              >${field.defaultValue || ''}</textarea>
            </div>
          `;

        case 'select':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <select id="${fieldId}" name="${field.field}" class="block-builder-form-control" ${required}>
                <option value="">Выберите...</option>
                ${field.options?.map((option: any) =>
                  `<option value="${option.value}" ${option.value === field.defaultValue ? 'selected' : ''}>${option.label}</option>`
                ).join('') || ''}
              </select>
            </div>
          `;

        case 'number':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="number"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                value="${field.defaultValue || ''}"
                ${required}
              />
            </div>
          `;

        case 'color':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="color"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                value="${field.defaultValue || '#333333'}"
                ${required}
              />
            </div>
          `;

        case 'url':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="url"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                value="${field.defaultValue || ''}"
                ${required}
              />
            </div>
          `;

        case 'checkbox':
          return `
            <div class="block-builder-form-group">
              <label class="block-builder-form-checkbox">
                <input
                  type="checkbox"
                  id="${fieldId}"
                  name="${field.field}"
                  class="block-builder-form-checkbox-input"
                  ${field.defaultValue ? 'checked' : ''}
                />
                <span class="block-builder-form-checkbox-label">${field.label}</span>
              </label>
            </div>
          `;

        default: // text
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="text"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                value="${field.defaultValue || ''}"
                ${required}
              />
            </div>
          `;
      }
    }).join('');
  }

  /**
   * Закрытие модального окна
   */
  public closeModal(): void {
    const modal = document.getElementById('block-builder-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * Отправка формы
   */
  public submitForm(type: string): void {
    const form = document.getElementById('block-builder-form') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const props: Record<string, any> = {};

    // Собираем данные формы
    for (const [key, value] of formData.entries()) {
      props[key] = value;
    }

    // Валидация
    if (!this.validateForm(props, type)) {
      return;
    }

    // Создаем блок
    this.createBlock({
      type,
      settings: {},
      props,
      visible: true, // Блоки видимы по умолчанию
      locked: false
    }).then(() => {
      this.closeModal();
      this.fetchBlocks().then(() => this.renderBlocks());
    }).catch(error => {
      alert(`Ошибка создания блока: ${error.message}`);
    });
  }

  /**
   * Валидация формы
   */
  private validateForm(props: Record<string, any>, type: string): boolean {
    const config = this.blockConfigs[type];
    if (!config || !config.fields) return true;

    for (const field of config.fields) {
      const value = props[field.field];
      const rules = field.rules || [];

      for (const rule of rules) {
        if (rule.type === 'required' && (!value || value.toString().trim() === '')) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }

        if (rule.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }

        if (rule.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }

        if (rule.type === 'min' && value && Number(value) < rule.value) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }

        if (rule.type === 'max' && value && Number(value) > rule.value) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }

        if (rule.type === 'minLength' && value && value.length < rule.value) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }

        if (rule.type === 'maxLength' && value && value.length > rule.value) {
          alert(`${field.label}: ${rule.message}`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Редактирование блока
   */
  public editBlock(blockId: string): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    const config = this.blockConfigs[block.type];
    if (!config) {
      alert(`Конфигурация для типа "${block.type}" не найдена`);
      return;
    }

    // Создаем модальное окно с формой редактирования
    this.createEditModalForm(block, config);
  }

  /**
   * Создание модального окна для редактирования блока
   */
  private createEditModalForm(block: IBlockDto, config: any): void {
    // Удаляем существующее модальное окно
    const existingModal = document.getElementById('block-builder-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const fields = config.fields || [];
    const formHTML = this.generateEditFormHTML(fields, config.title, block.props);

    const modalHTML = `
      <div id="block-builder-modal" class="block-builder-modal">
        <div class="block-builder-modal-content">
          <div class="block-builder-modal-header">
            <h3>Редактировать ${config.title}</h3>
            <button onclick="blockBuilder.closeModal()" class="block-builder-modal-close">&times;</button>
          </div>
          <div class="block-builder-modal-body">
            <form id="block-builder-form" class="block-builder-form">
              ${formHTML}
            </form>
          </div>
          <div class="block-builder-modal-footer">
            <button onclick="blockBuilder.closeModal()" class="block-builder-btn block-builder-btn-secondary">Отмена</button>
            <button onclick="blockBuilder.submitEditForm('${block.id}')" class="block-builder-btn block-builder-btn-primary">Сохранить</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.addModalStyles();
  }

  /**
   * Генерация HTML формы редактирования
   */
  private generateEditFormHTML(fields: any[], title: string, currentProps: Record<string, any>): string {
    return fields.map(field => {
      const fieldId = `field-${field.field}`;
      const required = field.rules?.some((rule: any) => rule.type === 'required') ? 'required' : '';
      const currentValue = currentProps[field.field] || field.defaultValue || '';

      switch (field.type) {
        case 'textarea':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <textarea
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                ${required}
                rows="3"
              >${currentValue}</textarea>
            </div>
          `;

        case 'select':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <select id="${fieldId}" name="${field.field}" class="block-builder-form-control" ${required}>
                <option value="">Выберите...</option>
                ${field.options?.map((option: any) =>
                  `<option value="${option.value}" ${option.value === currentValue ? 'selected' : ''}>${option.label}</option>`
                ).join('') || ''}
              </select>
            </div>
          `;

        case 'number':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="number"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                value="${currentValue}"
                ${required}
              />
            </div>
          `;

        case 'color':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="color"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                value="${currentValue || '#333333'}"
                ${required}
              />
            </div>
          `;

        case 'url':
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="url"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                value="${currentValue}"
                ${required}
              />
            </div>
          `;

        case 'checkbox':
          return `
            <div class="block-builder-form-group">
              <label class="block-builder-form-checkbox">
                <input
                  type="checkbox"
                  id="${fieldId}"
                  name="${field.field}"
                  class="block-builder-form-checkbox-input"
                  ${currentValue ? 'checked' : ''}
                />
                <span class="block-builder-form-checkbox-label">${field.label}</span>
              </label>
            </div>
          `;

        default: // text
          return `
            <div class="block-builder-form-group">
              <label for="${fieldId}" class="block-builder-form-label">
                ${field.label} ${required ? '<span class="required">*</span>' : ''}
              </label>
              <input
                type="text"
                id="${fieldId}"
                name="${field.field}"
                class="block-builder-form-control"
                placeholder="${field.placeholder || ''}"
                value="${currentValue}"
                ${required}
              />
            </div>
          `;
      }
    }).join('');
  }

  /**
   * Отправка формы редактирования
   */
  public submitEditForm(blockId: string): void {
    const form = document.getElementById('block-builder-form') as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const props: Record<string, any> = {};

    // Собираем данные формы
    for (const [key, value] of formData.entries()) {
      props[key] = value;
    }

    // Валидация
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    if (!this.validateForm(props, block.type)) {
      return;
    }

    // Обновляем блок
    this.updateBlock(blockId, { props })
      .then(() => {
        this.closeModal();
        this.fetchBlocks().then(() => this.renderBlocks());
      })
      .catch(error => {
        alert(`Ошибка обновления блока: ${error.message}`);
      });
  }

  /**
   * Переключение блокировки блока
   */
  public async toggleBlockLock(blockId: string): Promise<void> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    await this.setBlockLocked(blockId, !block.locked);
    await this.fetchBlocks();
    this.renderBlocks();
  }

  /**
   * Переключение видимости блока
   */
  public async toggleBlockVisibility(blockId: string): Promise<void> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    await this.setBlockVisible(blockId, !block.visible);
    await this.fetchBlocks();
    this.renderBlocks();
  }

  /**
   * UI: Удаление блока
   */
  public async deleteBlockUI(blockId: string): Promise<void> {
    if (confirm('Удалить блок?')) {
      await this.useCase.deleteBlock(blockId);
      await this.fetchBlocks();
      this.renderBlocks();
    }
  }

  /**
   * UI: Дублирование блока
   */
  public async duplicateBlockUI(blockId: string): Promise<void> {
    await this.useCase.duplicateBlock(blockId);
    await this.fetchBlocks();
    this.renderBlocks();
  }

  /**
   * UI: Очистка всех блоков
   */
  public async clearAllBlocksUI(): Promise<void> {
    if (confirm('Удалить все блоки?')) {
      await this.repository.clear();
      await this.fetchBlocks();
      this.renderBlocks();
    }
  }

  /**
   * Перемещение блока вверх
   */
  public async moveBlockUp(blockId: string): Promise<void> {
    const currentIndex = this.blocks.findIndex(block => block.id === blockId);
    if (currentIndex <= 0) return; // Уже наверху

    // Меняем местами с предыдущим блоком
    const newBlocks = [...this.blocks];
    [newBlocks[currentIndex], newBlocks[currentIndex - 1]] = [newBlocks[currentIndex - 1], newBlocks[currentIndex]];

    // Обновляем порядок в репозитории
    const blockIds = newBlocks.map(block => block.id);
    await this.reorderBlocks(blockIds);

    // Обновляем UI
    await this.fetchBlocks();
    this.renderBlocks();
  }

  /**
   * Перемещение блока вниз
   */
  public async moveBlockDown(blockId: string): Promise<void> {
    const currentIndex = this.blocks.findIndex(block => block.id === blockId);
    if (currentIndex >= this.blocks.length - 1) return; // Уже внизу

    // Меняем местами со следующим блоком
    const newBlocks = [...this.blocks];
    [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [newBlocks[currentIndex + 1], newBlocks[currentIndex]];

    // Обновляем порядок в репозитории
    const blockIds = newBlocks.map(block => block.id);
    await this.reorderBlocks(blockIds);

    // Обновляем UI
    await this.fetchBlocks();
    this.renderBlocks();
  }
}
