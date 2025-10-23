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
import { copyToClipboard } from '../../utils/copyToClipboard';
import { UniversalValidator } from '../../utils/universalValidation';

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
   * Показать модалку выбора типа блока
   */
  showBlockTypeSelectionModal(position?: number): void {
    const blockTypesHTML = Object.entries(this.config.blockConfigs)
      .map(([type, config]) => {
        const title = config.title || type;
        const icon = config.icon || '📦';
        return `
          <button 
            onclick="blockBuilder.showAddBlockFormAtPosition('${type}', ${position !== undefined ? position : 'undefined'})" 
            class="block-builder-block-type-card"
          >
            <span class="block-builder-block-type-card__icon">${icon}</span>
            <span class="block-builder-block-type-card__title">${title}</span>
          </button>
        `;
      })
      .join('');

    const bodyHTML = `
      <div class="block-builder-block-type-selection">
        ${blockTypesHTML}
      </div>
    `;

    this.styleManager.injectModalStyles();
    this.modalManager.showModal({
      title: 'Выберите тип блока',
      bodyHTML,
      onSubmit: () => this.modalManager.closeModal(),
      onCancel: () => this.modalManager.closeModal(),
      submitButtonText: 'Отмена',
      hideSubmitButton: true
    });
  }

  /**
   * Показать форму добавления блока на определенной позиции
   */
  showAddBlockFormAtPosition(type: string, position?: number): void {
    // Закрываем модалку выбора типа
    this.modalManager.closeModal();

    const config = this.config.blockConfigs[type];
    if (!config) {
      this.showError(`Конфигурация для типа "${type}" не найдена`);
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
      onSubmit: () => this.handleCreateBlock(type, fields, position),
      onCancel: () => this.closeModalWithCleanup(),
      submitButtonText: 'Добавить'
    });
  }

  /**
   * Показать форму добавления блока (старый метод для обратной совместимости)
   */
  showAddBlockForm(type: string): void {
    this.showAddBlockFormAtPosition(type);
  }

  /**
   * Обработка создания блока
   */
  private async handleCreateBlock(type: string, fields: IFieldConfig[], position?: number): Promise<void> {
    const props = this.modalManager.getFormData('block-builder-form');

    // Валидация с помощью UniversalValidator
    const validation = UniversalValidator.validateForm(props, fields);
    if (!validation.isValid) {
      this.showValidationErrors(validation.errors);
      return;
    }

    try {
      // Получаем конфигурацию блока
      const blockConfig = this.config.blockConfigs[type];
      
      // Создаем данные блока
      const createData: ICreateBlockDto = {
        type,
        settings: {},
        props,
        visible: true,
        locked: false
      };

      // Добавляем render из конфигурации, если он есть
      if (blockConfig?.render) {
        createData.render = blockConfig.render;
      }

      // Создаем блок через use case
      const newBlock = await this.config.useCase.createBlock(createData);

      // Если указана позиция, перемещаем блок на нужное место
      if (position !== undefined && newBlock) {
        await this.insertBlockAtPosition(newBlock.id, position);
      }

      this.modalManager.closeModal();
      await this.refreshBlocks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.showError(`Ошибка создания блока: ${errorMessage}`);
    }
  }

  /**
   * Вставка блока на определенную позицию
   */
  private async insertBlockAtPosition(blockId: string, position: number): Promise<void> {
    const allBlocks = await this.config.useCase.getAllBlocks();
    const blockIds = allBlocks.map(b => b.id);
    
    // Удаляем новый блок из конца
    const newBlockIndex = blockIds.indexOf(blockId);
    if (newBlockIndex !== -1) {
      blockIds.splice(newBlockIndex, 1);
    }
    
    // Вставляем на нужную позицию
    blockIds.splice(position, 0, blockId);
    
    // Обновляем порядок
    await this.config.useCase.reorderBlocks(blockIds);
  }

  /**
   * Редактирование блока
   */
  editBlock(blockId: string): void {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    const config = this.config.blockConfigs[block.type];
    if (!config) {
      this.showError(`Конфигурация для типа "${block.type}" не найдена`);
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
      onCancel: () => this.closeModalWithCleanup(),
      submitButtonText: 'Сохранить'
    });
  }

  /**
   * Обработка обновления блока
   */
  private async handleUpdateBlock(blockId: string, type: string, fields: IFieldConfig[]): Promise<void> {
    const props = this.modalManager.getFormData('block-builder-form');

    // Валидация с помощью UniversalValidator
    const validation = UniversalValidator.validateForm(props, fields);
    if (!validation.isValid) {
      this.showValidationErrors(validation.errors);
      return;
    }

    try {
      // Обновляем блок через use case
      await this.config.useCase.updateBlock(blockId, { props });

      this.modalManager.closeModal();
      await this.refreshBlocks();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.showError(`Ошибка обновления блока: ${errorMessage}`);
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
   * Копирование ID блока в буфер обмена
   */
  copyBlockId(blockId: string): void {
    const success = copyToClipboard(blockId);
    if (success) {
      this.showNotification(`ID скопирован: ${blockId}`, 'success');
    }
  }

  /**
   * Показать уведомление (универсальный метод)
   */
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification = document.createElement('div');
    notification.className = 'block-builder-notification';
    notification.textContent = message;
    
    const colors = {
      success: '#4caf50',
      error: '#dc3545',
      info: '#007bff'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: fadeIn 0.3s ease-in-out;
    `;
    document.body.appendChild(notification);

    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  /**
   * Показать ошибки валидации в форме
   */
  private showValidationErrors(errors: Record<string, string[]>): void {
    // Сначала очищаем все старые ошибки
    this.clearValidationErrors();

    // Добавляем новые ошибки
    Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
      const input = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
      if (input) {
        // Добавляем класс ошибки к полю
        input.classList.add('error');

        // Создаем контейнер для ошибок
        const errorContainer = document.createElement('div');
        errorContainer.className = 'block-builder-form-errors';
        errorContainer.setAttribute('data-field', fieldName);

        fieldErrors.forEach(error => {
          const errorSpan = document.createElement('span');
          errorSpan.className = 'error';
          errorSpan.textContent = error;
          errorContainer.appendChild(errorSpan);
        });

        // Вставляем контейнер с ошибками после поля
        input.parentElement?.appendChild(errorContainer);
      }
    });
  }

  /**
   * Очистить все ошибки валидации
   */
  private clearValidationErrors(): void {
    // Убираем класс error у всех полей
    document.querySelectorAll('.block-builder-form-control.error').forEach(input => {
      input.classList.remove('error');
    });

    // Удаляем все контейнеры с ошибками
    document.querySelectorAll('.block-builder-form-errors').forEach(container => {
      container.remove();
    });
  }

  /**
   * Показать ошибку
   */
  private showError(message: string): void {
    this.showNotification(message, 'error');
  }

  /**
   * Закрытие модального окна с очисткой ошибок
   */
  private closeModalWithCleanup(): void {
    this.clearValidationErrors();
    this.modalManager.closeModal();
  }

  /**
   * Закрытие модального окна (публичный метод)
   */
  closeModal(): void {
    this.closeModalWithCleanup();
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

