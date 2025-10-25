/**
 * BlockUIController - координирует UI операции с блоками
 * Применяем паттерн Controller из MVC
 * Принцип единой ответственности (SRP) + Dependency Inversion Principle (DIP)
 */

import { IBlockDto, ICreateBlockDto, IUpdateBlockDto } from '../../core/types';
import { BlockManagementUseCase } from '../../core/use-cases/BlockManagementUseCase';
import { ApiSelectUseCase } from '../../core/use-cases/ApiSelectUseCase';
import { UIRenderer } from '../services/UIRenderer';
import { FormBuilder, TFieldConfig } from '../services/FormBuilder';
import { ModalManager } from '../services/ModalManager';
import { StyleManager } from '../services/StyleManager';
import { SpacingControlRenderer } from '../services/SpacingControlRenderer';
import { RepeaterControlRenderer } from '../services/RepeaterControlRenderer';
import { ApiSelectControlRenderer } from '../services/ApiSelectControlRenderer';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { UniversalValidator } from '../../utils/universalValidation';
import { addSpacingFieldToFields } from '../../utils/blockSpacingHelpers';
import { scrollToFirstError, parseErrorKey } from '../../utils/formErrorHelpers';

export interface IBlockUIControllerConfig {
  containerId: string;
  blockConfigs: Record<string, any>;
  useCase: BlockManagementUseCase;
  apiSelectUseCase: ApiSelectUseCase;
  onSave?: (blocks: IBlockDto[]) => Promise<boolean> | boolean;
}

export class BlockUIController {
  private config: IBlockUIControllerConfig;
  private uiRenderer: UIRenderer;
  private formBuilder: FormBuilder;
  private modalManager: ModalManager;
  private styleManager: StyleManager;
  private apiSelectUseCase: ApiSelectUseCase;
  private blocks: IBlockDto[] = [];
  private onSave?: (blocks: IBlockDto[]) => Promise<boolean> | boolean;
  private spacingRenderers: Map<string, SpacingControlRenderer> = new Map();
  private repeaterRenderers: Map<string, RepeaterControlRenderer> = new Map();
  private apiSelectRenderers: Map<string, ApiSelectControlRenderer> = new Map();

  constructor(config: IBlockUIControllerConfig) {
    this.config = config;
    this.onSave = config.onSave;
    this.apiSelectUseCase = config.apiSelectUseCase;

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
    this.styleManager.injectStyles();

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

    this.styleManager.injectStyles();
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
  async showAddBlockFormAtPosition(type: string, position?: number): Promise<void> {
    // Закрываем модалку выбора типа
    this.modalManager.closeModal();

    const config = this.config.blockConfigs[type];
    if (!config) {
      this.showError(`Конфигурация для типа "${type}" не найдена`);
      return;
    }

    // Автоматически добавляем spacing поле, если его нет
    const fields: TFieldConfig[] = addSpacingFieldToFields(
      config.fields || [],
      config.spacingOptions
    );

    const formHTML = `
      <form id="block-builder-form" class="block-builder-form">
        ${this.formBuilder.generateCreateFormHTML(fields)}
      </form>
    `;

    this.styleManager.injectStyles();
    this.modalManager.showModal({
      title: `Добавить ${config.title}`,
      bodyHTML: formHTML,
      onSubmit: () => this.handleCreateBlock(type, fields, position),
      onCancel: () => this.closeModalWithCleanup(),
      submitButtonText: 'Добавить'
    });

    // Инициализируем spacing, repeater и api-select контролы после рендеринга модалки
    // Используем setTimeout чтобы дождаться следующего цикла событий когда DOM точно готов
    setTimeout(async () => {
      this.initializeSpacingControls();
      this.initializeRepeaterControls();
      await this.initializeApiSelectControls();
    }, 0);
  }

  /**
   * Показать форму добавления блока (старый метод для обратной совместимости)
   */
  showAddBlockForm(type: string): void {
    this.showAddBlockFormAtPosition(type);
  }

  /**
   * Инициализация spacing контролов
   */
  private initializeSpacingControls(): void {
    // Очищаем старые рендереры
    this.cleanupSpacingControls();

    // Находим все контейнеры для spacing
    const containers = document.querySelectorAll('.spacing-control-container');

    containers.forEach(container => {
      const config = container.getAttribute('data-spacing-config');
      if (!config) return;

      try {
        const spacingConfig = JSON.parse(config.replace(/&quot;/g, '"'));

        // Создаем рендерер
        const renderer = new SpacingControlRenderer({
          fieldName: spacingConfig.field,
          label: spacingConfig.label,
          required: spacingConfig.required,
          config: spacingConfig,
          value: spacingConfig.value || {},
          onChange: (value) => {
            // Обновление значения при изменении
            // Сохраняем в data-атрибуте для последующего получения
            container.setAttribute('data-spacing-value', JSON.stringify(value));
          }
        });

        // Рендерим контрол
        renderer.render(container as HTMLElement);

        // Сохраняем рендерер
        this.spacingRenderers.set(spacingConfig.field, renderer);
      } catch (error) {
        console.error('Ошибка инициализации spacing контрола:', error);
      }
    });
  }

  /**
   * Очистка spacing контролов
   */
  private cleanupSpacingControls(): void {
    this.spacingRenderers.forEach(renderer => {
      renderer.destroy();
    });
    this.spacingRenderers.clear();
  }

  /**
   * Инициализация repeater контролов
   */
  private initializeRepeaterControls(): void {
    // Очищаем старые рендереры
    this.cleanupRepeaterControls();

    // Находим все контейнеры для repeater
    const containers = document.querySelectorAll('.repeater-control-container');

    containers.forEach(container => {
      const config = container.getAttribute('data-repeater-config');
      if (!config) return;

      try {
        const repeaterConfig = JSON.parse(config.replace(/&quot;/g, '"'));

        // Создаем рендерер
        const renderer = new RepeaterControlRenderer({
          fieldName: repeaterConfig.field,
          label: repeaterConfig.label,
          rules: repeaterConfig.rules || [],
          config: repeaterConfig,
          value: repeaterConfig.value || [],
          onChange: (value) => {
            // Обновление значения при изменении
            // Сохраняем в data-атрибуте для последующего получения
            container.setAttribute('data-repeater-value', JSON.stringify(value));
          }
        });

        // Рендерим контрол
        renderer.render(container as HTMLElement);

        // Сохраняем рендерер
        this.repeaterRenderers.set(repeaterConfig.field, renderer);
      } catch (error) {
        console.error('Ошибка инициализации repeater контрола:', error);
      }
    });
  }

  /**
   * Очистка repeater контролов
   */
  private cleanupRepeaterControls(): void {
    this.repeaterRenderers.forEach(renderer => {
      renderer.destroy();
    });
    this.repeaterRenderers.clear();
  }

  /**
   * Инициализация api-select контролов
   */
  private async initializeApiSelectControls(): Promise<void> {
    // Очищаем старые рендереры
    this.cleanupApiSelectControls();

    // Находим все контейнеры для api-select
    const containers = document.querySelectorAll('.api-select-control-container');

    for (const container of Array.from(containers)) {
      const config = container.getAttribute('data-api-select-config');
      if (!config) {
        console.warn('⚠️ API Select: контейнер без конфигурации', container);
        continue;
      }

      try {
        const apiSelectConfig = JSON.parse(config.replace(/&quot;/g, '"'));

        // Создаем рендерер с внедрением ApiSelectUseCase
        const renderer = new ApiSelectControlRenderer({
          fieldName: apiSelectConfig.field,
          label: apiSelectConfig.label,
          rules: apiSelectConfig.rules || [],
          config: apiSelectConfig,
          value: apiSelectConfig.value || (apiSelectConfig.multiple ? [] : null),
          apiSelectUseCase: this.apiSelectUseCase,
          onChange: (value) => {
            // Обновление значения при изменении
            // Сохраняем в data-атрибуте для последующего получения
            container.setAttribute('data-api-select-value', JSON.stringify(value));
          }
        });

        // Инициализируем и рендерим контрол (асинхронно)
        await renderer.init(container as HTMLElement);

        // Сохраняем рендерер
        this.apiSelectRenderers.set(apiSelectConfig.field, renderer);
      } catch (error) {
        console.error('❌ Ошибка инициализации api-select контрола:', error);
      }
    }
  }

  /**
   * Очистка api-select контролов
   */
  private cleanupApiSelectControls(): void {
    // Вызываем destroy для каждого рендерера
    this.apiSelectRenderers.forEach((renderer) => {
      renderer.destroy();
    });
    this.apiSelectRenderers.clear();
  }

  /**
   * Получение данных формы с учетом spacing, repeater и api-select контролов
   */
  private getFormDataWithSpacing(formId: string): Record<string, any> {
    const props = this.modalManager.getFormData(formId);

    // Добавляем данные из spacing контролов
    this.spacingRenderers.forEach((renderer, fieldName) => {
      props[fieldName] = renderer.getValue();
    });

    // Добавляем данные из repeater контролов
    this.repeaterRenderers.forEach((renderer, fieldName) => {
      props[fieldName] = renderer.getValue();
    });

    // Добавляем данные из api-select контролов
    this.apiSelectRenderers.forEach((renderer, fieldName) => {
      props[fieldName] = renderer.getValue();
    });

    return props;
  }

  /**
   * Обработка создания блока
   */
  private async handleCreateBlock(type: string, fields: TFieldConfig[], position?: number): Promise<void> {
    const props = this.getFormDataWithSpacing('block-builder-form');

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
  async editBlock(blockId: string): Promise<void> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    const config = this.config.blockConfigs[block.type];
    if (!config) {
      this.showError(`Конфигурация для типа "${block.type}" не найдена`);
      return;
    }

    // Автоматически добавляем spacing поле, если его нет
    const fields: TFieldConfig[] = addSpacingFieldToFields(
      config.fields || [],
      config.spacingOptions
    );
    const formHTML = `
      <form id="block-builder-form" class="block-builder-form">
        ${this.formBuilder.generateEditFormHTML(fields, block.props)}
      </form>
    `;

    this.styleManager.injectStyles();
    this.modalManager.showModal({
      title: `Редактировать ${config.title}`,
      bodyHTML: formHTML,
      onSubmit: () => this.handleUpdateBlock(blockId, block.type, fields),
      onCancel: () => this.closeModalWithCleanup(),
      submitButtonText: 'Сохранить'
    });

    // Инициализируем spacing, repeater и api-select контролы после рендеринга модалки
    // Используем setTimeout чтобы дождаться следующего цикла событий когда DOM точно готов
    setTimeout(async () => {
      this.initializeSpacingControls();
      this.initializeRepeaterControls();
      await this.initializeApiSelectControls();
    }, 0);
  }

  /**
   * Обработка обновления блока
   */
  private async handleUpdateBlock(blockId: string, type: string, fields: TFieldConfig[]): Promise<void> {
    const props = this.getFormDataWithSpacing('block-builder-form');

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

    // Очищаем watcher для spacing перед удалением
    this.uiRenderer.cleanupBlockWatcher(blockId);

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
   * Сохранение всех блоков
   */
  async saveAllBlocksUI(): Promise<void> {
    // Если колбэк сохранения не указан, показываем предупреждение
    if (!this.onSave) {
      this.showNotification('Функция сохранения не настроена. Передайте onSave в конфигурацию BlockBuilder.', 'error');
      return;
    }

    try {
      const blocks = await this.config.useCase.getAllBlocks();
      const result = await Promise.resolve(this.onSave(blocks));

      if (result === true) {
        this.showNotification('Данные успешно сохранены', 'success');
      } else {
        this.showNotification('Произошла ошибка при сохранении', 'error');
      }
    } catch (error) {
      console.error('Ошибка при сохранении блоков:', error);
      this.showNotification('Произошла ошибка при сохранении', 'error');
    }
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

    // Удаляем уведомление через 12 секунд
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => notification.remove(), 300);
    }, 12000);
  }

  /**
   * Показать ошибки валидации в форме
   */
  private showValidationErrors(errors: Record<string, string[]>): void {
    // Сначала очищаем все старые ошибки
    this.clearValidationErrors();

    // Обновляем ошибки в repeater контролах
    this.repeaterRenderers.forEach((renderer) => {
      renderer.updateErrors(errors);
    });

    // Добавляем новые ошибки для обычных полей
    Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
      // Пропускаем ошибки repeater полей (формат: "cards[0].title")
      if (fieldName.includes('[') && fieldName.includes(']')) {
        return; // Эти ошибки обрабатываются в repeater контроле
      }

      const input = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
      if (input) {
        // Добавляем класс ошибки к полю
        input.classList.add('error');

        // Добавляем класс ошибки к группе поля
        const formGroup = input.closest('.block-builder-form-group') as HTMLElement;
        if (formGroup) {
          formGroup.classList.add('error');
        }

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

    // Скроллим к первой ошибке и открываем аккордеоны
    this.handleScrollToFirstError(errors);
  }

  /**
   * Очистить все ошибки валидации
   */
  private clearValidationErrors(): void {
    // Убираем класс error у всех полей
    document.querySelectorAll('.block-builder-form-control.error').forEach(input => {
      input.classList.remove('error');
    });

    // Убираем класс error у всех групп полей
    document.querySelectorAll('.block-builder-form-group.error').forEach(group => {
      group.classList.remove('error');
    });

    // Удаляем все контейнеры с ошибками
    document.querySelectorAll('.block-builder-form-errors').forEach(container => {
      container.remove();
    });
  }

  /**
   * Обработка скролла к первой ошибке
   */
  private handleScrollToFirstError(errors: Record<string, string[]>): void {
    // Небольшая задержка, чтобы ошибки успели отрисоваться в DOM
    setTimeout(() => {
      const modalBody = document.querySelector('.block-builder-modal-body') as HTMLElement;

      if (!modalBody) {
        console.warn('[handleScrollToFirstError] Не найден контейнер модального окна');
        return;
      }

      // Находим первую ошибку
      const firstErrorKey = Object.keys(errors)[0];
      if (!firstErrorKey) return;

      const errorInfo = parseErrorKey(firstErrorKey);

      // Если ошибка в repeater - СНАЧАЛА открываем аккордеон, ПОТОМ скроллим
      if (errorInfo.isRepeaterField && errorInfo.repeaterFieldName) {
        this.openRepeaterAccordion(
          errorInfo.repeaterFieldName,
          errorInfo.repeaterIndex || 0
        );
        // Скролл произойдет автоматически внутри openRepeaterAccordion после раскрытия
      } else {
        // Для обычных полей скроллим сразу
        scrollToFirstError(modalBody, errors, {
          offset: 40,
          behavior: 'smooth',
          autoFocus: true
        });
      }
    }, 100); // Увеличена задержка для стабильной отрисовки ошибок
  }

  /**
   * Открытие аккордеона в repeater для конкретного элемента
   */
  private openRepeaterAccordion(repeaterFieldName: string, itemIndex: number): void {
    // Получаем renderer для этого repeater
    const renderer = this.repeaterRenderers.get(repeaterFieldName);

    if (!renderer) {
      console.warn(`[openRepeaterAccordion] Не найден renderer для repeater: ${repeaterFieldName}`);
      return;
    }

    const modalBody = document.querySelector('.block-builder-modal-body') as HTMLElement;
    if (!modalBody) return;

    // Проверяем, свернут ли элемент
    if (renderer.isItemCollapsed(itemIndex)) {
      console.log('[openRepeaterAccordion] Раскрываем аккордеон для элемента:', itemIndex);

      // Раскрываем элемент
      renderer.expandItem(itemIndex);

      // После раскрытия скроллим к конкретному полю
      // Увеличенная задержка для завершения анимации раскрытия
      setTimeout(() => {
        console.log('[openRepeaterAccordion] Скролл к полю после раскрытия аккордеона');

        // Используем исходные ошибки для скролла - они уже содержат все нужные данные
        const allErrors: Record<string, string[]> = {};
        Object.entries(this.repeaterRenderers.get(repeaterFieldName)?.['errors'] || {}).forEach(([key, value]) => {
          allErrors[key] = value;
        });

        // Скроллим к полю с ошибкой
        scrollToFirstError(modalBody, allErrors, {
          offset: 40,
          behavior: 'smooth',
          autoFocus: true
        });
      }, 350); // Увеличена задержка для завершения анимации раскрытия
    } else {
      console.log('[openRepeaterAccordion] Элемент уже развернут, скроллим к полю');

      // Элемент уже развернут - скроллим к полю сразу
      scrollToFirstError(modalBody, this.getRepeaterErrors(), {
        offset: 40,
        behavior: 'smooth',
        autoFocus: true
      });
    }
  }

  /**
   * Получить все ошибки из repeater для скролла
   */
  private getRepeaterErrors(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    // Ищем все сообщения об ошибках в DOM
    document.querySelectorAll('.repeater-control__field-error').forEach(errorEl => {
      const field = errorEl.closest('.repeater-control__field') as HTMLElement;
      if (field) {
        const input = field.querySelector('input, textarea, select') as HTMLElement;
        if (input) {
          const dataIndex = input.getAttribute('data-item-index');
          const fieldName = input.getAttribute('data-field-name');

          if (dataIndex !== null && fieldName) {
            // Находим имя repeater по структуре DOM
            const repeaterControl = field.closest('.repeater-control') as HTMLElement;
            if (repeaterControl) {
              const repeaterFieldName = repeaterControl.getAttribute('data-field-name');
              if (repeaterFieldName) {
                const errorKey = `${repeaterFieldName}[${dataIndex}].${fieldName}`;
                errors[errorKey] = [errorEl.textContent || ''];
              }
            }
          }
        }
      }
    });

    return errors;
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
    this.cleanupSpacingControls();
    this.cleanupRepeaterControls();
    this.cleanupApiSelectControls();
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
    this.cleanupSpacingControls();
    this.styleManager.removeAllStyles();
    this.modalManager.closeModal();
  }
}

