/**
 * BlockUIController - координирует UI операции с блоками
 * Применяем паттерн Controller из MVC
 * Принцип единой ответственности (SRP) + Dependency Inversion Principle (DIP)
 */

import { IBlockDto, ICreateBlockDto, IUpdateBlockDto } from '../../core/types';
import { BlockManagementUseCase } from '../../core/use-cases/BlockManagementUseCase';
import { UIRenderer } from '../services/UIRenderer';
import { FormBuilder, IFieldConfig } from '../services/FormBuilder';
import { ModalManager } from '../services/ModalManager';
import { StyleManager } from '../services/StyleManager';

export interface IBlockUIControllerConfig {
  containerId: string;
  blockConfigs: Record<string, any>;
  useCase: BlockManagementUseCase;
}

export class BlockUIController {
  private config: IBlockUIControllerConfig;
  private uiRenderer: UIRenderer;
  private formBuilder: FormBuilder;
  private modalManager: ModalManager;
  private styleManager: StyleManager;
  private blocks: IBlockDto[] = [];

  constructor(config: IBlockUIControllerConfig) {
    this.config = config;
    
    // Инициализация сервисов (Dependency Injection)
    this.uiRenderer = new UIRenderer({
      containerId: config.containerId,
      blockConfigs: config.blockConfigs,
      componentRegistry: config.useCase.getComponentRegistry()
    });
    this.formBuilder = new FormBuilder();
    this.modalManager = new ModalManager();
    this.styleManager = new StyleManager();
  }

  /**
   * Инициализация UI
   */
  async init(): Promise<void> {
    // Инъекция стилей
    this.styleManager.injectMainStyles();
    
    // Рендеринг UI
    this.uiRenderer.renderContainer();
    
    // Загрузка и отображение блоков
    await this.refreshBlocks();
  }

  /**
   * Обновление списка блоков
   */
  async refreshBlocks(): Promise<void> {
    this.blocks = await this.config.useCase.getAllBlocks();
    this.uiRenderer.renderBlocks(this.blocks);
  }

  /**
   * Показать форму добавления блока
   */
  showAddBlockForm(type: string): void {
    const config = this.config.blockConfigs[type];
    if (!config) {
      alert(`Конфигурация для типа "${type}" не найдена`);
      return;
    }

    const fields: IFieldConfig[] = config.fields || [];
    const formHTML = `
      <form id="block-builder-form" class="block-builder-form">
        ${this.formBuilder.generateCreateFormHTML(fields)}
      </form>
    `;

    this.styleManager.injectModalStyles();
    this.modalManager.showModal({
      title: `Добавить ${config.title}`,
      bodyHTML: formHTML,
      onSubmit: () => this.handleCreateBlock(type, fields),
      onCancel: () => this.modalManager.closeModal(),
      submitButtonText: 'Добавить'
    });
  }

  /**
   * Обработка создания блока
   */
  private async handleCreateBlock(type: string, fields: IFieldConfig[]): Promise<void> {
    const props = this.modalManager.getFormData('block-builder-form');

    // Валидация
    const validation = this.formBuilder.validateForm(props, fields);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      // Создаем блок через use case
      await this.config.useCase.createBlock({
        type,
        settings: {},
        props,
        visible: true,
        locked: false
      });

      this.modalManager.closeModal();
      await this.refreshBlocks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Ошибка создания блока: ${errorMessage}`);
    }
  }

  /**
   * Редактирование блока
   */
  editBlock(blockId: string): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    const config = this.config.blockConfigs[block.type];
    if (!config) {
      alert(`Конфигурация для типа "${block.type}" не найдена`);
      return;
    }

    const fields: IFieldConfig[] = config.fields || [];
    const formHTML = `
      <form id="block-builder-form" class="block-builder-form">
        ${this.formBuilder.generateEditFormHTML(fields, block.props)}
      </form>
    `;

    this.styleManager.injectModalStyles();
    this.modalManager.showModal({
      title: `Редактировать ${config.title}`,
      bodyHTML: formHTML,
      onSubmit: () => this.handleUpdateBlock(blockId, block.type, fields),
      onCancel: () => this.modalManager.closeModal(),
      submitButtonText: 'Сохранить'
    });
  }

  /**
   * Обработка обновления блока
   */
  private async handleUpdateBlock(blockId: string, type: string, fields: IFieldConfig[]): Promise<void> {
    const props = this.modalManager.getFormData('block-builder-form');

    // Валидация
    const validation = this.formBuilder.validateForm(props, fields);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      // Обновляем блок через use case
      await this.config.useCase.updateBlock(blockId, { props });

      this.modalManager.closeModal();
      await this.refreshBlocks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Ошибка обновления блока: ${errorMessage}`);
    }
  }

  /**
   * Переключение блокировки блока
   */
  async toggleBlockLock(blockId: string): Promise<void> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    await this.config.useCase.setBlockLocked(blockId, !block.locked);
    await this.refreshBlocks();
  }

  /**
   * Переключение видимости блока
   */
  async toggleBlockVisibility(blockId: string): Promise<void> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    await this.config.useCase.setBlockVisible(blockId, !block.visible);
    await this.refreshBlocks();
  }

  /**
   * Удаление блока
   */
  async deleteBlockUI(blockId: string): Promise<void> {
    if (!confirm('Удалить блок?')) return;

    await this.config.useCase.deleteBlock(blockId);
    await this.refreshBlocks();
  }

  /**
   * Дублирование блока
   */
  async duplicateBlockUI(blockId: string): Promise<void> {
    await this.config.useCase.duplicateBlock(blockId);
    await this.refreshBlocks();
  }

  /**
   * Очистка всех блоков
   */
  async clearAllBlocksUI(): Promise<void> {
    if (!confirm('Удалить все блоки?')) return;

    const allBlocks = await this.config.useCase.getAllBlocks();
    for (const block of allBlocks) {
      await this.config.useCase.deleteBlock(block.id);
    }
    await this.refreshBlocks();
  }

  /**
   * Перемещение блока вверх
   */
  async moveBlockUp(blockId: string): Promise<void> {
    const currentIndex = this.blocks.findIndex(block => block.id === blockId);
    if (currentIndex <= 0) return; // Уже наверху

    // Меняем местами с предыдущим блоком
    const newBlocks = [...this.blocks];
    [newBlocks[currentIndex], newBlocks[currentIndex - 1]] = [newBlocks[currentIndex - 1], newBlocks[currentIndex]];

    // Обновляем порядок
    const blockIds = newBlocks.map(block => block.id);
    await this.config.useCase.reorderBlocks(blockIds);

    await this.refreshBlocks();
  }

  /**
   * Перемещение блока вниз
   */
  async moveBlockDown(blockId: string): Promise<void> {
    const currentIndex = this.blocks.findIndex(block => block.id === blockId);
    if (currentIndex >= this.blocks.length - 1) return; // Уже внизу

    // Меняем местами со следующим блоком
    const newBlocks = [...this.blocks];
    [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [newBlocks[currentIndex + 1], newBlocks[currentIndex]];

    // Обновляем порядок
    const blockIds = newBlocks.map(block => block.id);
    await this.config.useCase.reorderBlocks(blockIds);

    await this.refreshBlocks();
  }

  /**
   * Закрытие модального окна (публичный метод)
   */
  closeModal(): void {
    this.modalManager.closeModal();
  }

  /**
   * Submit модального окна (публичный метод)
   */
  submitModal(): void {
    this.modalManager.submitModal();
  }

  /**
   * Очистка ресурсов
   */
  destroy(): void {
    this.styleManager.removeAllStyles();
    this.modalManager.closeModal();
  }
}

