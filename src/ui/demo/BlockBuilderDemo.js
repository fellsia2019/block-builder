/**
 * BlockBuilder (Demo UI) — демонстрационная оболочка UI для примеров
 * Не является частью ядра/пакета. Хранится в src/ui/demo согласно чистой архитектуре.
 */

import { MemoryBlockRepositoryImpl, MemoryComponentRegistry, BlockManagementUseCase } from '/dist/index.esm.js';

export class BlockBuilder {
    constructor(options) {
        this.containerId = options.containerId;
        this.blockConfigs = options.blockConfigs;
        this.theme = options.theme || 'light';
        this.locale = options.locale || 'ru';
        // Инициализация use case-ов ядра
        this.repository = new MemoryBlockRepositoryImpl();
        this.componentRegistry = new MemoryComponentRegistry();
        this.useCase = new BlockManagementUseCase(this.repository, this.componentRegistry);
        this.blocks = [];
        this.init();
    }

    init() {
        this.renderUI();
        // Первичная загрузка данных из репозитория и рендер
        this.fetchBlocks().then(() => this.renderBlocks());
        window.blockBuilder = this; // доступ из примеров
    }

    renderUI() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
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
                    <button onclick="blockBuilder.clearAllBlocks()" class="block-builder-btn block-builder-btn-danger">🗑️ Очистить все</button>
                </div>
                <div class="block-builder-stats"><p>Всего блоков: <span id="blocks-count">0</span></p></div>
                <div class="block-builder-blocks" id="block-builder-blocks"></div>
            </div>
        `;
        this.addStyles();
        // Регистрируем все компоненты из blockConfigs
        const components = Object.fromEntries(Object.entries(this.blockConfigs)
            .filter(([, cfg]) => !!cfg.component)
            .map(([key, cfg]) => [cfg.component.name || key, cfg.component])
        );
        if (Object.keys(components).length > 0) {
            this.useCase.registerComponents(components);
        }
        // Перерисуем после возможной регистрации компонентов
        this.fetchBlocks().then(() => this.renderBlocks());
    }

    // Загружает блоки из репозитория в память
    fetchBlocks() {
        return this.useCase.getAllBlocks().then(blocks => {
            this.blocks = blocks;
            return blocks;
        });
    }

    addStyles() {
        if (document.getElementById('block-builder-styles')) return;
        const style = document.createElement('style');
        style.id = 'block-builder-styles';
        style.textContent = `
            .block-builder-app { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            .block-builder-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; }
            .block-builder-btn { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s ease; text-decoration: none; display: inline-block; text-align: center; }
            .block-builder-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
            .block-builder-btn-primary { background: #007bff; color: white; }
            .block-builder-btn-primary:hover { background: #0056b3; }
            .block-builder-btn-secondary { background: #6c757d; color: white; }
            .block-builder-btn-danger { background: #dc3545; color: white; }
            .block-builder-stats { display: flex; gap: 20px; margin-bottom: 20px; padding: 15px; background: #e9ecef; border-radius: 6px; font-size: 14px; color: #495057; }
            .block-builder-blocks { display: flex; flex-direction: column; gap: 15px; }
            .block-builder-block { border: 2px solid #007bff; border-radius: 8px; background: rgba(0, 123, 255, 0.05); margin-bottom: 20px; transition: all 0.3s ease; position: relative; }
            .block-builder-block:hover { background: rgba(0, 123, 255, 0.1); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2); }
            .block-builder-block.locked { border-color: #dc3545; background: rgba(220, 53, 69, 0.05); }
            .block-builder-block.hidden { opacity: 0.3; }
            .block-builder-block-header { background: rgba(0, 123, 255, 0.1); padding: 10px 15px; border-bottom: 1px solid #007bff; display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #2c3e50; }
            .block-builder-block-info { display: flex; align-items: center; gap: 10px; }
            .block-builder-block-controls { display: flex; gap: 5px; }
            .block-builder-control-btn { background: none; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.2s; }
            .block-builder-control-btn:hover { background: rgba(0, 0, 0, 0.1); }
            .block-builder-block-content { padding: 20px; min-height: 50px; }
        `;
        document.head.appendChild(style);
    }

    showAddBlockForm(type) {
        const blockConfig = this.blockConfigs[type];
        if (!blockConfig) return;
        this.showModal(`
            <div class="block-builder-modal-content">
                <h2>Добавить ${blockConfig.title}</h2>
                <p>${blockConfig.description}</p>
                <form id="block-builder-block-form" class="block-builder-form">
                    ${blockConfig.fields.map(field => `
                        <div class="block-builder-field">
                            <label for="${field.field}">${field.label}</label>
                            ${this.renderField(field)}
                            <div class="block-builder-field-error" id="error-${field.field}" style="display: none;"></div>
                        </div>
                    `).join('')}
                    <div class="block-builder-form-actions">
                        <button type="button" onclick="blockBuilder.hideModal()" class="block-builder-btn block-builder-btn-secondary">Отмена</button>
                        <button type="submit" class="block-builder-btn block-builder-btn-primary">Создать блок</button>
                    </div>
                </form>
            </div>
        `);
        const form = document.getElementById('block-builder-block-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createBlock(type, form);
            });
        }
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'block-builder-modal';
        modal.innerHTML = `
            <div class="block-builder-modal-overlay" onclick="blockBuilder.hideModal()"></div>
            <div class="block-builder-modal-dialog">${content}</div>
        `;
        document.body.appendChild(modal);
        if (!document.getElementById('block-builder-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'block-builder-modal-styles';
            style.textContent = `
                .block-builder-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
                .block-builder-modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }
                .block-builder-modal-dialog { position: relative; background: white; border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
                .block-builder-modal-content { padding: 30px; }
                .block-builder-form { margin-top: 20px; }
                .block-builder-field { margin-bottom: 20px; }
                .block-builder-field label { display: block; margin-bottom: 5px; font-weight: 600; color: #333; }
                .block-builder-field input, .block-builder-field textarea, .block-builder-field select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
                .block-builder-field textarea { min-height: 80px; resize: vertical; }
                .block-builder-field-error { color: #dc3545; font-size: 12px; margin-top: 5px; }
                .block-builder-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            `;
            document.head.appendChild(style);
        }
    }

    hideModal() {
        const modal = document.querySelector('.block-builder-modal');
        if (modal) modal.remove();
    }

    renderField(field, currentValue = null) {
        const baseAttrs = `id="${field.field}" name="${field.field}" placeholder="${field.placeholder || ''}"`;
        const value = currentValue !== null ? currentValue : (field.defaultValue || '');
        switch (field.type) {
            case 'textarea': return `<textarea ${baseAttrs}>${value}</textarea>`;
            case 'select': {
                const options = field.options ? field.options.map(opt => `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`).join('') : '';
                return `<select ${baseAttrs}>${options}</select>`;
            }
            case 'number': return `<input type="number" ${baseAttrs} value="${value}" min="${field.min || ''}" max="${field.max || ''}">`;
            case 'color': return `<input type="color" ${baseAttrs} value="${value || '#000000'}">`;
            case 'url': return `<input type="url" ${baseAttrs} value="${value}">`;
            case 'checkbox': return `<input type="checkbox" ${baseAttrs} ${value ? 'checked' : ''}>`;
            default: return `<input type="text" ${baseAttrs} value="${value}">`;
        }
    }

    createBlock(type, form) {
        const formData = new FormData(form);
        const blockData = {};
        for (const [key, value] of formData.entries()) blockData[key] = value;
        const blockConfig = this.blockConfigs[type];
        let hasErrors = false;
        for (const field of blockConfig.fields) {
            const value = blockData[field.field];
            if (field.rules) {
                for (const rule of field.rules) {
                    if (rule.type === 'required' && (!value || value.trim() === '')) hasErrors = true;
                    else if (rule.type === 'minLength' && value && value.length < rule.value) hasErrors = true;
                    else if (rule.type === 'min' && value && parseFloat(value) < rule.value) hasErrors = true;
                    else if (rule.type === 'max' && value && parseFloat(value) > rule.value) hasErrors = true;
                    if (hasErrors) this.showFieldError(field.field, rule.message);
                }
            }
        }
        if (hasErrors) return;
        // Создание через Use Case
        this.useCase.createBlock({
            type,
            props: blockData,
            settings: {
                fontSize: blockData.fontSize || 16,
                color: blockData.color || '#333333',
                backgroundColor: blockData.backgroundColor || '#ffffff',
                borderRadius: blockData.borderRadius || 0
            },
            visible: true,
            locked: false
        }).then(() => this.fetchBlocks().then(() => this.renderBlocks()));
        this.hideModal();
    }

    updateBlock(blockId, form) {
        const formData = new FormData(form);
        const blockData = {};
        for (const [key, value] of formData.entries()) blockData[key] = value;
        const block = this.blocks.find(b => b.id === blockId);
        if (!block) return;
        const cfg = this.blockConfigs[block.type];
        let hasErrors = false;
        for (const field of cfg.fields) {
            const value = blockData[field.field];
            if (field.rules) {
                for (const rule of field.rules) {
                    if (rule.type === 'required' && (!value || value.trim() === '')) hasErrors = true;
                    else if (rule.type === 'minLength' && value && value.length < rule.value) hasErrors = true;
                    else if (rule.type === 'min' && value && parseFloat(value) < rule.value) hasErrors = true;
                    else if (rule.type === 'max' && value && parseFloat(value) > rule.value) hasErrors = true;
                    if (hasErrors) this.showFieldError(field.field, rule.message);
                }
            }
        }
        if (hasErrors) return;
        this.useCase.updateBlock(blockId, {
            props: blockData,
            settings: {
                ...block.settings,
                fontSize: blockData.fontSize || block.settings.fontSize,
                color: blockData.color || block.settings.color,
                backgroundColor: blockData.backgroundColor || block.settings.backgroundColor,
                borderRadius: blockData.borderRadius || block.settings.borderRadius
            }
        }).then(() => this.fetchBlocks().then(() => this.renderBlocks()));
        this.hideModal();
    }

    showFieldError(fieldName, message) {
        const el = document.getElementById(`error-${fieldName}`);
        if (el) { el.textContent = message; el.style.display = 'block'; }
    }

    editBlock(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (!block) return;
        const cfg = this.blockConfigs[block.type];
        if (!cfg) return;
        this.showModal(`
            <div class="block-builder-modal-content">
                <h2>Редактировать ${cfg.title}</h2>
                <p>${cfg.description}</p>
                <form id="block-builder-block-form" class="block-builder-form">
                    ${cfg.fields.map(field => `
                        <div class="block-builder-field">
                            <label for="${field.field}">${field.label}</label>
                            ${this.renderField(field, block.props[field.field])}
                            <div class="block-builder-field-error" id="error-${field.field}" style="display: none;"></div>
                        </div>
                    `).join('')}
                    <div class="block-builder-form-actions">
                        <button type="button" onclick="blockBuilder.hideModal()" class="block-builder-btn block-builder-btn-secondary">Отмена</button>
                        <button type="submit" class="block-builder-btn block-builder-btn-primary">Сохранить изменения</button>
                    </div>
                </form>
            </div>
        `);
        const form = document.getElementById('block-builder-block-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateBlock(blockId, form);
            });
        }
    }

    deleteBlock(blockId) { if (confirm('Удалить этот блок?')) { this.useCase.deleteBlock(blockId).then(() => this.fetchBlocks().then(() => this.renderBlocks())); } }
    clearAllBlocks() { this.repository.clear().then(() => { this.blocks = []; this.renderBlocks(); }); }

    // Рендерит текущее состояние in-memory this.blocks (без повторной загрузки)
    renderBlocks() {
        const container = document.getElementById('block-builder-blocks');
        if (!container) return;
        container.innerHTML = this.blocks.map(block => `
            <div class="block-builder-block ${block.locked ? 'locked' : ''} ${!block.visible ? 'hidden' : ''}">
                <div class="block-builder-block-header">
                    <div class="block-builder-block-info">
                        <span class="block-builder-block-type">${block.type}</span>
                        <span class="block-builder-block-id">${block.id}</span>
                    </div>
                    <div class="block-builder-block-controls">
                        <button class="block-builder-control-btn" onclick="blockBuilder.moveBlockUp('${block.id}')" title="Переместить вверх">⬆️</button>
                        <button class="block-builder-control-btn" onclick="blockBuilder.moveBlockDown('${block.id}')" title="Переместить вниз">⬇️</button>
                        <button class="block-builder-control-btn" onclick="blockBuilder.editBlock('${block.id}')" title="Редактировать">✏️</button>
                        <button class="block-builder-control-btn" onclick="blockBuilder.deleteBlock('${block.id}')" title="Удалить">🗑️</button>
                        <button class="block-builder-control-btn" onclick="blockBuilder.toggleVisibility('${block.id}')" title="Скрыть/показать">${block.visible ? '👁️' : '🙈'}</button>
                        <button class="block-builder-control-btn" onclick="blockBuilder.toggleLock('${block.id}')" title="Заблокировать/разблокировать">${block.locked ? '🔒' : '🔓'}</button>
                    </div>
                </div>
                <div class="block-builder-block-content">${this.getRenderedContent(block)}</div>
            </div>
        `).join('');
        const countEl = document.getElementById('blocks-count');
        if (countEl) countEl.textContent = this.blocks.length;
        this.initializeVueComponents();
        this.bindBlockContentEvents();
    }

    getRenderedContent(block) {
        const cfg = this.blockConfigs[block.type];
        if (!cfg) return `<div>Блок ${block.type}</div>`;
        if (cfg.component) return this.renderVueComponent(block);
        if (cfg.template) return this.renderHtmlTemplate(block);
        return `<div>Блок ${block.type}</div>`;
    }

    renderVueComponent(block) {
        const cfg = this.blockConfigs[block.type];
        if (!cfg || !cfg.component) return `<div>Vue компонент: ${block.type}</div>`;
        const id = `vue-component-${block.id}`;
        return `<div id="${id}" data-block-id="${block.id}" data-block-type="${block.type}"></div>`;
    }

    renderHtmlTemplate(block) {
        const cfg = this.blockConfigs[block.type];
        if (!cfg || !cfg.template) return `<div>HTML template: ${block.type}</div>`;
        if (typeof cfg.template === 'function') return cfg.template(block.props);
        return cfg.template;
    }

    toggleVisibility(blockId) { const b = this.blocks.find(x => x.id === blockId); if (b) { b.visible = !b.visible; this.renderBlocks(); } }
    toggleLock(blockId) { const b = this.blocks.find(x => x.id === blockId); if (b) { b.locked = !b.locked; this.renderBlocks(); } }

    initializeVueComponents() {
        this.blocks.forEach(block => {
            const cfg = this.blockConfigs[block.type];
            if (cfg && cfg.component) {
                const id = `vue-component-${block.id}`;
                const container = document.getElementById(id);
                if (container && !container.hasAttribute('data-vue-mounted')) {
                    this.mountVueComponent(block, cfg.component, container);
                }
            }
        });
    }

    mountVueComponent(block, component, container) {
        if (typeof window.Vue === 'undefined') {
            container.innerHTML = `<div>Vue компонент: ${block.type}</div>`;
            return;
        }
        try {
            const app = window.Vue.createApp({
                components: { [component.name || 'BlockComponent']: component },
                data() { return { blockProps: block.props, blockSettings: block.settings }; },
                template: `<${component.name || 'BlockComponent'} v-bind="blockProps" />`
            });
            app.mount(container);
            container.setAttribute('data-vue-mounted', 'true');
        } catch (error) {
            console.error('Ошибка монтирования Vue компонента:', error);
            container.innerHTML = `<div>Ошибка Vue компонента: ${block.type}</div>`;
        }
    }

    bindBlockContentEvents() {
        const contents = document.querySelectorAll('.block-builder-block-content');
        contents.forEach(content => {
            content.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) return;
                const anchor = target.closest('a');
                if (anchor && anchor.classList.contains('card-button')) event.preventDefault();
                const cardEl = target.closest('.card, .card-item');
                if (cardEl) {
                    const title = cardEl.querySelector('h3')?.textContent || '';
                    const text = cardEl.querySelector('p')?.textContent || '';
                    const button = cardEl.querySelector('a')?.textContent || '';
                    const link = cardEl.querySelector('a')?.getAttribute('href') || '';
                    const image = cardEl.querySelector('img')?.getAttribute('src') || '';
                    const card = { title, text, button, link, image };
                    this.showCardDetailModal(card);
                }
            }, { capture: true });
        });
    }

    showCardDetailModal(card) {
        const content = `
            <div class="block-builder-card-modal">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="margin:0;">${card.title || 'Детали карточки'}</h3>
                    <button class="block-builder-btn block-builder-btn-secondary" onclick="blockBuilder.hideModal()">×</button>
                </div>
                ${card.image ? `<img src="${card.image}" alt="${card.title}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;" />` : ''}
                <p style="color:#555;line-height:1.6;">${card.text || ''}</p>
                ${card.button && card.link ? `
                    <div style="margin-top:16px;text-align:right;">
                        <a href="${card.link}" target="_blank" class="block-builder-btn block-builder-btn-primary" onclick="event.preventDefault(); window.open('${card.link}', '_blank'); blockBuilder.hideModal();">${card.button}</a>
                    </div>
                ` : ''}
            </div>
        `;
        this.showModal(content);
    }

    moveBlockUp(blockId) { const i = this.blocks.findIndex(b => b.id === blockId); if (i > 0) { const t = this.blocks[i - 1]; this.blocks[i - 1] = this.blocks[i]; this.blocks[i] = t; this.renderBlocks(); } }
    moveBlockDown(blockId) { const i = this.blocks.findIndex(b => b.id === blockId); if (i !== -1 && i < this.blocks.length - 1) { const t = this.blocks[i + 1]; this.blocks[i + 1] = this.blocks[i]; this.blocks[i] = t; this.renderBlocks(); } }
}


