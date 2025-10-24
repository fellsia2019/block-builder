/**
 * UIRenderer - отвечает только за рендеринг UI
 * Принцип единой ответственности (SRP)
 */

import { IBlockDto } from '../../core/types';
import { getBlockInlineStyles, watchBreakpointChanges } from '../../utils/breakpointHelpers';
import { ISpacingData } from '../../utils/spacingHelpers';

export interface IUIRendererConfig {
  containerId: string;
  blockConfigs: Record<string, any>;
  componentRegistry: any;
}

export class UIRenderer {
  private config: IUIRendererConfig;
  private breakpointUnsubscribers: Map<string, () => void> = new Map();

  constructor(config: IUIRendererConfig) {
    this.config = config;
  }

  /**
   * Получение props для пользовательского компонента (без служебного spacing)
   */
  private getUserComponentProps(props: Record<string, any>): Record<string, any> {
    if (!props) return {};
    
    // Исключаем spacing - это служебное поле для BlockBuilder
    const { spacing, ...userProps } = props;
    
    return userProps;
  }

  /**
   * Рендеринг основного UI контейнера
   */
  renderContainer(): void {
    const container = document.getElementById(this.config.containerId);
    if (!container) {
      console.warn(`Container with id "${this.config.containerId}" not found`);
      return;
    }

    container.innerHTML = `
      <div class="block-builder-app">
        <div class="block-builder-controls">
          ${this.renderControlButtons()}
        </div>
        <div class="block-builder-stats">
          <p>Всего блоков: <span id="blocks-count">0</span></p>
        </div>
        <div class="block-builder-blocks" id="block-builder-blocks"></div>
      </div>
    `;
  }

  /**
   * Рендеринг кнопок управления
   */
  private renderControlButtons(): string {
    return `
      <button onclick="blockBuilder.saveAllBlocksUI()" class="block-builder-btn block-builder-btn--success">
        💾 Сохранить
      </button>
      <button onclick="blockBuilder.clearAllBlocksUI()" class="block-builder-btn block-builder-btn--danger">
        🗑️ Очистить все
      </button>
    `;
  }

  /**
   * Рендеринг кнопки добавления блока
   */
  private renderAddBlockButton(position: number): string {
    return `
      <div class="block-builder-add-block-separator">
        <button 
          onclick="blockBuilder.showBlockTypeSelectionModal(${position})" 
          class="block-builder-add-block-btn"
          title="Добавить блок"
        >
          <span class="block-builder-add-block-btn__icon">+</span>
          <span class="block-builder-add-block-btn__text">Добавить блок</span>
        </button>
      </div>
    `;
  }

  /**
   * Рендеринг списка блоков
   */
  renderBlocks(blocks: IBlockDto[]): void {
    const blocksContainer = document.getElementById('block-builder-blocks');
    const countElement = document.getElementById('blocks-count');

    if (!blocksContainer || !countElement) return;

    // Очищаем старые watchers перед перерендером
    this.cleanupBreakpointWatchers();

    // Обновляем счетчик
    countElement.textContent = blocks.length.toString();

    if (blocks.length === 0) {
      // Если блоков нет, показываем только одну кнопку добавления
      blocksContainer.innerHTML = `
        <div class="block-builder-empty-state">
          ${this.renderAddBlockButton(0)}
        </div>
      `;
      return;
    }

    // Рендерим блоки с кнопками добавления между ними
    const blocksHTML: string[] = [];
    
    // Кнопка перед первым блоком
    blocksHTML.push(this.renderAddBlockButton(0));
    
    // Блоки с кнопками после каждого
    blocks.forEach((block, index) => {
      blocksHTML.push(this.renderBlock(block));
      blocksHTML.push(this.renderAddBlockButton(index + 1));
    });

    blocksContainer.innerHTML = blocksHTML.join('');

    // Инициализируем custom блоки после рендеринга
    setTimeout(() => {
      this.initializeCustomBlocks(blocks);
      // Настраиваем watchers для spacing после рендеринга DOM
      this.setupBreakpointWatchers(blocks);
    }, 0);
  }

  /**
   * Рендеринг отдельного блока
   */
  private renderBlock(block: IBlockDto): string {
    const config = this.config.blockConfigs[block.type];
    if (!config) return '';

    const blockContent = this.renderBlockContent(block, config);
    
    // Генерируем spacing стили из props.spacing
    // margin - напрямую, padding - через CSS переменные
    const spacingStylesObj = getBlockInlineStyles(block.props.spacing || {}, 'spacing');
    const styleAttr = Object.keys(spacingStylesObj).length > 0 
      ? ` style="${this.objectToStyleString(spacingStylesObj)}"` 
      : '';

    return `
      <div class="block-builder-block ${block.locked ? 'locked' : ''} ${!block.visible ? 'hidden' : ''}" data-block-id="${block.id}"${styleAttr}>
        <div class="block-builder-block-header">
          <div class="block-builder-block-info">
            <span>📦 ${config.title}</span>
            <small class="block-builder-block-id">
              ID: ${block.id}
              <button 
                onclick="blockBuilder.copyBlockId('${block.id}')" 
                class="block-builder-copy-id-btn" 
                title="Копировать ID"
              >📋</button>
            </small>
            ${block.locked ? '<span class="locked-indicator">🔒</span>' : ''}
            ${!block.visible ? '<span class="hidden-indicator">👁️‍🗨️</span>' : ''}
          </div>
          <div class="block-builder-block-controls">
            ${this.renderBlockControls(block)}
          </div>
        </div>
        <div class="block-builder-block-content">
          ${blockContent}
        </div>
      </div>
    `;
  }

  /**
   * Преобразование объекта стилей в строку
   */
  private objectToStyleString(styles: Record<string, string>): string {
    return Object.entries(styles)
      .map(([key, value]) => {
        // Конвертируем camelCase в kebab-case для CSS свойств
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  }

  /**
   * Рендеринг элементов управления блока
   */
  private renderBlockControls(block: IBlockDto): string {
    return `
      <button onclick="blockBuilder.moveBlockUp('${block.id}')" class="block-builder-control-btn" title="Переместить вверх">⬆️</button>
      <button onclick="blockBuilder.moveBlockDown('${block.id}')" class="block-builder-control-btn" title="Переместить вниз">⬇️</button>
      <button onclick="blockBuilder.editBlock('${block.id}')" class="block-builder-control-btn" title="Редактировать">✏️</button>
      <button onclick="blockBuilder.duplicateBlockUI('${block.id}')" class="block-builder-control-btn" title="Дублировать">📋</button>
      <button onclick="blockBuilder.toggleBlockLock('${block.id}')" class="block-builder-control-btn" title="${block.locked ? 'Разблокировать' : 'Заблокировать'}">${block.locked ? '🔓' : '🔒'}</button>
      <button onclick="blockBuilder.toggleBlockVisibility('${block.id}')" class="block-builder-control-btn" title="${block.visible ? 'Скрыть' : 'Показать'}">${block.visible ? '👁️' : '👁️‍🗨️'}</button>
      <button onclick="blockBuilder.deleteBlockUI('${block.id}')" class="block-builder-control-btn" title="Удалить">🗑️</button>
    `;
  }

  /**
   * Рендеринг содержимого блока
   */
  private renderBlockContent(block: IBlockDto, config: any): string {
    // Получаем props без служебного spacing
    const userProps = this.getUserComponentProps(block.props);

    // Если есть custom render с функцией mount
    if (config.render?.kind === 'custom' && config.render?.mount) {
      return this.renderCustomBlock(block);
    }

    // Если есть Vue компонент
    if (config.render?.kind === 'component' && config.render?.component) {
      return this.renderVueComponent(block, config);
    }

    // Если есть HTML шаблон в render
    if (config.render?.kind === 'html' && config.render?.template) {
      const template = config.render.template;
      return typeof template === 'function' ? template(userProps) : template;
    }

    // Fallback на старый формат template
    if (config.template) {
      return typeof config.template === 'function' ? config.template(userProps) : config.template;
    }

    // Fallback - простое отображение
    return `
      <div class="block-content-fallback">
        <strong>${config.title}</strong>
        <pre>${JSON.stringify(userProps, null, 2)}</pre>
      </div>
    `;
  }

  /**
   * Рендеринг Vue компонента
   */
  private renderVueComponent(block: IBlockDto, config: any): string {
    const componentId = `vue-component-${block.id}`;
    const componentName = config.render.component.name;
    const userProps = this.getUserComponentProps(block.props);

    // Создаем контейнер для Vue компонента
    const containerHTML = `
      <div id="${componentId}" class="vue-component-container">
        <!-- Vue компонент будет монтирован здесь -->
      </div>
    `;

    // Монтируем Vue компонент асинхронно
    setTimeout(() => {
      this.mountVueComponent(componentId, componentName, userProps);
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
    const component = this.config.componentRegistry.get(componentName);
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
   * Рендеринг custom блока (с императивной функцией mount)
   */
  private renderCustomBlock(block: IBlockDto): string {
    const containerId = `custom-block-${block.id}`;
    return `<div id="${containerId}" class="custom-block-container" data-block-id="${block.id}"></div>`;
  }

  /**
   * Инициализация custom блоков после рендеринга
   */
  private initializeCustomBlocks(blocks: IBlockDto[]): void {
    blocks.forEach(block => {
      const config = this.config.blockConfigs[block.type];
      if (config?.render?.kind === 'custom' && config.render.mount) {
        const containerId = `custom-block-${block.id}`;
        const container = document.getElementById(containerId);
        
        if (container && !container.hasAttribute('data-custom-mounted')) {
          try {
            // Получаем props без служебного spacing
            const userProps = this.getUserComponentProps(block.props);
            
            // Вызываем функцию mount с контейнером и пропсами
            config.render.mount(container, userProps);
            container.setAttribute('data-custom-mounted', 'true');
          } catch (error) {
            console.error(`Ошибка монтирования custom блока ${block.id}:`, error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            container.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">
              <strong>⚠️ Ошибка рендеринга:</strong><br>${errorMessage}
            </div>`;
          }
        }
      }
    });
  }

  /**
   * Настройка watchers для отслеживания брекпоинтов и обновления spacing
   */
  private setupBreakpointWatchers(blocks: IBlockDto[]): void {
    blocks.forEach(block => {
      const spacing = block.props?.spacing as ISpacingData | undefined;
      
      if (!spacing || Object.keys(spacing).length === 0) {
        return;
      }

      // Находим DOM элемент блока
      const element = document.querySelector(`[data-block-id="${block.id}"]`) as HTMLElement;
      
      if (!element) {
        return;
      }

      // Отписываемся от старого watcher, если есть
      const oldUnsubscribe = this.breakpointUnsubscribers.get(block.id);
      if (oldUnsubscribe) {
        oldUnsubscribe();
      }

      // Получаем конфиг блока для определения breakpoints
      const blockConfig = this.config.blockConfigs[block.type];
      const breakpoints = blockConfig?.spacingOptions?.config?.breakpoints;

      // Настраиваем новый watcher
      const unsubscribe = watchBreakpointChanges(element, spacing, 'spacing', breakpoints);
      this.breakpointUnsubscribers.set(block.id, unsubscribe);
    });
  }

  /**
   * Очистка всех watchers
   */
  private cleanupBreakpointWatchers(): void {
    this.breakpointUnsubscribers.forEach(unsubscribe => unsubscribe());
    this.breakpointUnsubscribers.clear();
  }

  /**
   * Очистка watcher для конкретного блока
   */
  cleanupBlockWatcher(blockId: string): void {
    const unsubscribe = this.breakpointUnsubscribers.get(blockId);
    if (unsubscribe) {
      unsubscribe();
      this.breakpointUnsubscribers.delete(blockId);
    }
  }
}


