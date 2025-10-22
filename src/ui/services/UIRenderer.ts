/**
 * UIRenderer - отвечает только за рендеринг UI
 * Принцип единой ответственности (SRP)
 */

import { IBlockDto } from '../../core/types';

export interface IUIRendererConfig {
  containerId: string;
  blockConfigs: Record<string, any>;
  componentRegistry: any;
}

export class UIRenderer {
  private config: IUIRendererConfig;

  constructor(config: IUIRendererConfig) {
    this.config = config;
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
    return Object.keys(this.config.blockConfigs).map(type => {
      const config = this.config.blockConfigs[type];
      return `
        <button onclick="blockBuilder.showAddBlockForm('${type}')" class="block-builder-btn block-builder-btn-primary">
          📝 Добавить ${config.title}
        </button>
      `;
    }).join('') + `
      <button onclick="blockBuilder.clearAllBlocksUI()" class="block-builder-btn block-builder-btn-danger">
        🗑️ Очистить все
      </button>
    `;
  }

  /**
   * Рендеринг списка блоков
   */
  renderBlocks(blocks: IBlockDto[]): void {
    const blocksContainer = document.getElementById('block-builder-blocks');
    const countElement = document.getElementById('blocks-count');

    if (!blocksContainer || !countElement) return;

    // Обновляем счетчик
    countElement.textContent = blocks.length.toString();

    if (blocks.length === 0) {
      blocksContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Блоков пока нет. Добавьте первый блок!</p>';
      return;
    }

    // Рендерим блоки
    blocksContainer.innerHTML = blocks.map(block => this.renderBlock(block)).join('');
  }

  /**
   * Рендеринг отдельного блока
   */
  private renderBlock(block: IBlockDto): string {
    const config = this.config.blockConfigs[block.type];
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
}

