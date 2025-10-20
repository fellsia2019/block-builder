/**
 * BlockBuilder - Блочный конструктор с чистой архитектурой
 * Основной класс пакета для управления блоками
 */

export class BlockBuilder {
    constructor(options) {
        this.containerId = options.containerId;
        this.blockConfigs = options.blockConfigs;
        this.theme = options.theme || 'light';
        this.locale = options.locale || 'ru';
        this.blocks = [];
        this.init();
    }

    init() {
        this.renderUI();
        // Make methods globally accessible for demo purposes
        window.blockBuilder = this;
    }

    renderUI() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="naberika-app">
                <div class="naberika-controls">
                    ${Object.keys(this.blockConfigs).map(type => {
                        const config = this.blockConfigs[type];
                        return `
                            <button onclick="blockBuilder.showAddBlockForm('${type}')" class="naberika-btn naberika-btn-primary">
                                📝 Добавить ${config.title}
                            </button>
                        `;
                    }).join('')}
                    <button onclick="blockBuilder.clearAllBlocks()" class="naberika-btn naberika-btn-danger">
                        🗑️ Очистить все
                    </button>
                </div>
                
                <div class="naberika-stats">
                    <p>Всего блоков: <span id="blocks-count">0</span></p>
                </div>
                
                <div class="naberika-blocks" id="naberika-blocks">
                    <!-- Blocks will be rendered here -->
                </div>
            </div>
        `;
        
        this.addStyles();
        this.renderBlocks(); // Initial render
    }

    addStyles() {
        if (document.getElementById('naberika-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'naberika-styles';
        style.textContent = `
            .naberika-app {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .naberika-controls {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            
            .naberika-btn {
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
            
            .naberika-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .naberika-btn-primary { background: #007bff; color: white; }
            .naberika-btn-primary:hover { background: #0056b3; }
            .naberika-btn-secondary { background: #6c757d; color: white; }
            .naberika-btn-secondary:hover { background: #545b62; }
            .naberika-btn-success { background: #28a745; color: white; }
            .naberika-btn-success:hover { background: #1e7e34; }
            .naberika-btn-warning { background: #ffc107; color: #212529; }
            .naberika-btn-warning:hover { background: #e0a800; }
            .naberika-btn-danger { background: #dc3545; color: white; }
            .naberika-btn-danger:hover { background: #c82333; }
            
            .naberika-stats {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
                padding: 15px;
                background: #e9ecef;
                border-radius: 6px;
                font-size: 14px;
                color: #495057;
            }
            
            .naberika-blocks { display: flex; flex-direction: column; gap: 15px; }
            .naberika-block { border: 2px solid #007bff; border-radius: 8px; background: rgba(0, 123, 255, 0.05); margin-bottom: 20px; transition: all 0.3s ease; position: relative; }
            .naberika-block:hover { background: rgba(0, 123, 255, 0.1); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2); }
            .naberika-block.locked { border-color: #dc3545; background: rgba(220, 53, 69, 0.05); }
            .naberika-block.hidden { opacity: 0.3; }
            .naberika-block-header { background: rgba(0, 123, 255, 0.1); padding: 10px 15px; border-bottom: 1px solid #007bff; display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #2c3e50; }
            .naberika-block-info { display: flex; align-items: center; gap: 10px; }
            .naberika-block-type { font-weight: 600; text-transform: capitalize; }
            .naberika-block-id { font-family: monospace; font-size: 12px; color: #666; }
            .naberika-block-controls { display: flex; gap: 5px; }
            .naberika-control-btn { background: none; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.2s; }
            .naberika-control-btn:hover { background: rgba(0, 0, 0, 0.1); }
            .naberika-block-content { padding: 20px; min-height: 50px; }
            .naberika-block-status { position: absolute; top: 5px; right: 5px; font-size: 12px; padding: 2px 6px; border-radius: 3px; background: rgba(0, 0, 0, 0.1); }
        `;
        document.head.appendChild(style);
    }

    showAddBlockForm(type) {
        const blockConfig = this.blockConfigs[type];
        if (!blockConfig) return;
        
        this.showModal(`
            <div class="naberika-modal-content">
                <h2>Добавить ${blockConfig.title}</h2>
                <p>${blockConfig.description}</p>
                
                <form id="naberika-block-form" class="naberika-form">
                    ${blockConfig.fields.map(field => `
                        <div class="naberika-field">
                            <label for="${field.field}">${field.label}</label>
                            ${this.renderField(field)}
                            <div class="naberika-field-error" id="error-${field.field}" style="display: none;"></div>
                        </div>
                    `).join('')}
                    
                    <div class="naberika-form-actions">
                        <button type="button" onclick="blockBuilder.hideModal()" class="naberika-btn naberika-btn-secondary">Отмена</button>
                        <button type="submit" class="naberika-btn naberika-btn-primary">Создать блок</button>
                    </div>
                </form>
            </div>
        `);
        
        const form = document.getElementById('naberika-block-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createBlock(type, form);
            });
        }
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'naberika-modal';
        modal.innerHTML = `
            <div class="naberika-modal-overlay" onclick="blockBuilder.hideModal()"></div>
            <div class="naberika-modal-dialog">${content}</div>
        `;
        document.body.appendChild(modal);
        
        if (!document.getElementById('naberika-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'naberika-modal-styles';
            style.textContent = `
                .naberika-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
                .naberika-modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }
                .naberika-modal-dialog { position: relative; background: white; border-radius: 8px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
                .naberika-modal-content { padding: 30px; }
                .naberika-form { margin-top: 20px; }
                .naberika-field { margin-bottom: 20px; }
                .naberika-field label { display: block; margin-bottom: 5px; font-weight: 600; color: #333; }
                .naberika-field input, .naberika-field textarea, .naberika-field select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
                .naberika-field textarea { min-height: 80px; resize: vertical; }
                .naberika-field-error { color: #dc3545; font-size: 12px; margin-top: 5px; }
                .naberika-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            `;
            document.head.appendChild(style);
        }
    }

    hideModal() {
        const modal = document.querySelector('.naberika-modal');
        if (modal) modal.remove();
    }

    renderField(field, currentValue = null) {
        const baseAttrs = `id="${field.field}" name="${field.field}" placeholder="${field.placeholder || ''}"`;
        const value = currentValue !== null ? currentValue : (field.defaultValue || '');
        switch (field.type) {
            case 'textarea': return `<textarea ${baseAttrs}>${value}</textarea>`;
            case 'select': {
                const options = field.options ? field.options.map(opt => 
                    `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`
                ).join('') : '';
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
        
        const block = {
            id: 'block_' + Date.now(),
            type: type,
            props: blockData,
            settings: {
                fontSize: blockData.fontSize || 16,
                color: blockData.color || '#333333',
                backgroundColor: blockData.backgroundColor || '#ffffff',
                borderRadius: blockData.borderRadius || 0
            },
            createdAt: new Date().toISOString(),
            visible: true,
            locked: false
        };
        this.blocks.push(block);
        this.renderBlocks();
        this.hideModal();
    }

    updateBlock(blockId, form) {
        const formData = new FormData(form);
        const blockData = {};
        for (const [key, value] of formData.entries()) blockData[key] = value;
        const blockIndex = this.blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return;
        const block = this.blocks[blockIndex];
        const blockConfig = this.blockConfigs[block.type];
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
        this.blocks[blockIndex] = {
            ...block,
            props: blockData,
            settings: {
                ...block.settings,
                fontSize: blockData.fontSize || block.settings.fontSize,
                color: blockData.color || block.settings.color,
                backgroundColor: blockData.backgroundColor || block.settings.backgroundColor,
                borderRadius: blockData.borderRadius || block.settings.borderRadius
            }
        };
        this.renderBlocks();
        this.hideModal();
    }

    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`error-${fieldName}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    editBlock(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (!block) return;
        const blockConfig = this.blockConfigs[block.type];
        if (!blockConfig) return;
        this.showModal(`
            <div class="naberika-modal-content">
                <h2>Редактировать ${blockConfig.title}</h2>
                <p>${blockConfig.description}</p>
                
                <form id="naberika-block-form" class="naberika-form">
                    ${blockConfig.fields.map(field => `
                        <div class="naberika-field">
                            <label for="${field.field}">${field.label}</label>
                            ${this.renderField(field, block.props[field.field])}
                            <div class="naberika-field-error" id="error-${field.field}" style="display: none;"></div>
                        </div>
                    `).join('')}
                    
                    <div class="naberika-form-actions">
                        <button type="button" onclick="blockBuilder.hideModal()" class="naberika-btn naberika-btn-secondary">Отмена</button>
                        <button type="submit" class="naberika-btn naberika-btn-primary">Сохранить изменения</button>
                    </div>
                </form>
            </div>
        `);
        const form = document.getElementById('naberika-block-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateBlock(blockId, form);
            });
        }
    }

    deleteBlock(blockId) {
        if (confirm('Удалить этот блок?')) {
            this.blocks = this.blocks.filter(block => block.id !== blockId);
            this.renderBlocks();
        }
    }

    clearAllBlocks() {
        this.blocks = [];
        this.renderBlocks();
    }

    renderBlocks() {
        const blocksContainer = document.getElementById('naberika-blocks');
        if (!blocksContainer) return;
        blocksContainer.innerHTML = this.blocks.map(block => `
            <div class="naberika-block ${block.locked ? 'locked' : ''} ${!block.visible ? 'hidden' : ''}">
                <div class="naberika-block-header">
                    <div class="naberika-block-info">
                        <span class="naberika-block-type">${block.type}</span>
                        <span class="naberika-block-id">${block.id}</span>
                    </div>
                    <div class="naberika-block-controls">
                        <button class="naberika-control-btn" onclick="blockBuilder.moveBlockUp('${block.id}')" title="Переместить вверх">⬆️</button>
                        <button class="naberika-control-btn" onclick="blockBuilder.moveBlockDown('${block.id}')" title="Переместить вниз">⬇️</button>
                        <button class="naberika-control-btn" onclick="blockBuilder.editBlock('${block.id}')" title="Редактировать">✏️</button>
                        <button class="naberika-control-btn" onclick="blockBuilder.deleteBlock('${block.id}')" title="Удалить">🗑️</button>
                        <button class="naberika-control-btn" onclick="blockBuilder.toggleVisibility('${block.id}')" title="Скрыть/показать">${block.visible ? '👁️' : '🙈'}</button>
                        <button class="naberika-control-btn" onclick="blockBuilder.toggleLock('${block.id}')" title="Заблокировать/разблокировать">${block.locked ? '🔒' : '🔓'}</button>
                    </div>
                </div>
                <div class="naberika-block-content">${this.getRenderedContent(block)}</div>
            </div>
        `).join('');
        document.getElementById('blocks-count').textContent = this.blocks.length;
        this.initializeVueComponents();
        this.bindBlockContentEvents();
    }

    getRenderedContent(block) {
        const blockConfig = this.blockConfigs[block.type];
        if (!blockConfig) return `<div>Блок ${block.type}</div>`;
        if (blockConfig.component) return this.renderVueComponent(block);
        if (blockConfig.template) return this.renderHtmlTemplate(block);
        return `<div>Блок ${block.type}</div>`;
    }

    renderVueComponent(block) {
        const blockConfig = this.blockConfigs[block.type];
        if (!blockConfig || !blockConfig.component) return `<div>Vue компонент: ${block.type}</div>`;
        const componentId = `vue-component-${block.id}`;
        return `<div id="${componentId}" data-block-id="${block.id}" data-block-type="${block.type}"></div>`;
    }

    renderHtmlTemplate(block) {
        const blockConfig = this.blockConfigs[block.type];
        if (!blockConfig || !blockConfig.template) return `<div>HTML template: ${block.type}</div>`;
        if (typeof blockConfig.template === 'function') return blockConfig.template(block.props);
        return blockConfig.template;
    }

    toggleVisibility(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) { block.visible = !block.visible; this.renderBlocks(); }
    }

    toggleLock(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) { block.locked = !block.locked; this.renderBlocks(); }
    }

    initializeVueComponents() {
        this.blocks.forEach(block => {
            const blockConfig = this.blockConfigs[block.type];
            if (blockConfig && blockConfig.component) {
                const componentId = `vue-component-${block.id}`;
                const container = document.getElementById(componentId);
                if (container && !container.hasAttribute('data-vue-mounted')) {
                    this.mountVueComponent(block, blockConfig.component, container);
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
        const contents = document.querySelectorAll('.naberika-block-content');
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
            <div class="naberika-card-modal">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="margin:0;">${card.title || 'Детали карточки'}</h3>
                    <button class="naberika-btn naberika-btn-secondary" onclick="blockBuilder.hideModal()">×</button>
                </div>
                ${card.image ? `<img src="${card.image}" alt="${card.title}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px;" />` : ''}
                <p style="color:#555;line-height:1.6;">${card.text || ''}</p>
                ${card.button && card.link ? `
                    <div style="margin-top:16px;text-align:right;">
                        <a href="${card.link}" target="_blank" class="naberika-btn naberika-btn-primary" onclick="event.preventDefault(); window.open('${card.link}', '_blank'); blockBuilder.hideModal();">${card.button}</a>
                    </div>
                ` : ''}
            </div>
        `;
        this.showModal(content);
    }

    moveBlockUp(blockId) {
        const index = this.blocks.findIndex(b => b.id === blockId);
        if (index > 0) {
            const tmp = this.blocks[index - 1];
            this.blocks[index - 1] = this.blocks[index];
            this.blocks[index] = tmp;
            this.renderBlocks();
        }
    }

    moveBlockDown(blockId) {
        const index = this.blocks.findIndex(b => b.id === blockId);
        if (index !== -1 && index < this.blocks.length - 1) {
            const tmp = this.blocks[index + 1];
            this.blocks[index + 1] = this.blocks[index];
            this.blocks[index] = tmp;
            this.renderBlocks();
        }
    }
}


