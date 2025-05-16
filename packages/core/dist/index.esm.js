var DEFAULT_TYPES;
(function (DEFAULT_TYPES) {
    DEFAULT_TYPES["BB_TEXT_BLOCK"] = "bb-text-block";
    DEFAULT_TYPES["BB_TEXT_IMG_BLOCK"] = "bb-text-img-block";
})(DEFAULT_TYPES || (DEFAULT_TYPES = {}));
const defaultTypesBlocks = {
    [DEFAULT_TYPES['BB_TEXT_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_BLOCK'],
        name: 'Текстовый блок',
        props: { text: '' }
    },
    [DEFAULT_TYPES['BB_TEXT_IMG_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_IMG_BLOCK'],
        name: 'Текст с изображением',
        props: { text: '', img: '' }
    }
};

class BlockManager {
    blocks = [];
    saveEndpoint;
    useDefaultTypesBlocks = false;
    registeredBlocks = {};
    constructor(initialBlocks = [], options = {}) {
        this.blocks = initialBlocks;
        this.saveEndpoint = options.saveEndpoint;
        this.useDefaultTypesBlocks = Boolean(options.useDefaultTypesBlocks);
        if (this.useDefaultTypesBlocks) {
            this.registeredBlocks = { ...defaultTypesBlocks };
        }
    }
    registerBlock(block) {
        if (Object.hasOwn(this.registeredBlocks, block.type)) {
            throw new Error(`Блок с таким типом (type: ${block.type}) уже существует!`);
        }
        this.registeredBlocks[block.type] = block;
        return block;
    }
    addBlock(type, props) {
        if (!Object.hasOwn(this.registeredBlocks, type)) {
            throw new Error(`Блок с таким типом (type: ${type}) не зарегистрирован!`);
        }
        const block = this.registeredBlocks[type];
        if (!block.id) {
            block.id = `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }
        if (props) {
            block.props = props;
        }
        this.blocks.push(block);
        return block;
    }
    editBlock(index, props) {
        if (index < 0 || index > this.blocks.length) {
            throw new Error(`Некорректный index: ${index}`);
        }
        const block = this.blocks[index];
        block.props = props;
        this.blocks = [...this.blocks.slice(0, index), block, ...this.blocks.slice(index + 1)];
        return block;
    }
    removeBlock(id) {
        this.blocks = this.blocks.filter(block => block.id !== id);
    }
    getBlocks() {
        return this.blocks;
    }
    async save() {
        if (!this.saveEndpoint) {
            throw new Error('Save endpoint is not defined');
        }
        await fetch(this.saveEndpoint, {
            method: 'POST',
            body: JSON.stringify(this.blocks),
        });
    }
}

class BlockRenderer {
    manager;
    renderers;
    constructor(manager, renderers) {
        this.manager = manager;
        this.renderers = renderers;
        this.manager = manager;
    }
    renderTo(container) {
        container.innerHTML = '';
        this.manager.getBlocks().forEach(block => {
            const element = this.createFallbackBlock(block);
            container.appendChild(element);
        });
    }
    createFallbackBlock(block) {
        const renderBoilerplate = this.renderers[block.type];
        let renderBlock = this.renderTemplate(renderBoilerplate, block);
        // найти в renderBoilerplate все вхождения по шаблону [[key]] и заменить на innerHTML из block.props[key]
        const div = document.createElement('div');
        div.classList.add('bb-section-block');
        div.innerHTML = renderBlock;
        return div;
    }
    renderTemplate(template, data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(template, 'text/html');
        // Обрабатываем цикл render-for
        this.processForDirectives(doc.body, data.props);
        // Обрабатываем условный рендеринг render-if
        this.processConditionalRendering(doc.body, data.props);
        // Обрабатываем шаблоны [[prop]]
        this.processTemplateExpressions(doc.body, data.props);
        return doc.body.innerHTML;
    }
    processConditionalRendering(element, props) {
        // Ищем все элементы с render-if
        const elements = element.querySelectorAll('[render-if]');
        elements.forEach(el => {
            const condition = el.getAttribute('render-if');
            el.removeAttribute('render-if');
            if (!this.evaluateCondition(props, condition)) {
                el.remove();
            }
        });
    }
    processTemplateExpressions(element, props) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === Node.TEXT_NODE) {
                this.processTextNode(node, props);
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                this.processElementAttributes(node, props);
            }
        }
    }
    processTextNode(node, context) {
        const newValue = node.nodeValue.replace(/\[\[\s*([^\]]+?)\s*\]\]/g, (_, expr) => this.evaluateExpression(expr, context));
        if (newValue !== node.nodeValue) {
            node.nodeValue = newValue;
        }
    }
    evaluateExpression(expr, context) {
        try {
            // Создаём безопасный контекст для eval
            const sandbox = {
                ...context,
                Math: Math,
                Date: Date,
                JSON: JSON
            };
            const value = new Function(...Object.keys(sandbox), `return ${expr}`)(...Object.values(sandbox));
            if (value === undefined || value === null)
                return '';
            if (typeof value === 'object')
                return JSON.stringify(value, null, 2);
            return String(value);
        }
        catch (e) {
            console.warn(`Error evaluating expression "${expr}":`, e);
            return '';
        }
    }
    processElementAttributes(element, props) {
        Array.from(element.attributes).forEach(attr => {
            if (attr.value.includes('[[')) {
                element.setAttribute(attr.name, attr.value.replace(/\[\[\s*([^\]]+?)\s*\]\]/g, (_, key) => this.getPropertyValue(props, key)));
            }
        });
    }
    getPropertyValue(props, key) {
        const value = key.split('.').reduce((obj, k) => obj?.[k], props);
        if (value === undefined || value === null)
            return '';
        if (typeof value === 'object')
            return JSON.stringify(value, null, 2);
        return String(value);
    }
    evaluateCondition(props, condition) {
        // Парсер условий
        if (condition.startsWith('!')) {
            return !this.getPropertyValue(props, condition.substring(1));
        }
        if (condition.includes('===')) {
            const [prop, value] = condition.split('===').map(s => s.trim());
            return this.getPropertyValue(props, prop) === value;
        }
        const value = this.getPropertyValue(props, condition);
        return ['number', 'boolean'].includes(typeof value)
            ? Boolean(value)
            : !!value;
    }
    processForDirectives(element, props) {
        const forElements = Array.from(element.querySelectorAll('[render-for]'));
        forElements.forEach(el => {
            const expression = el.getAttribute('render-for');
            el.removeAttribute('render-for');
            // Парсер выражения
            const { itemName, indexName, collectionPath } = this.parseForExpression(expression);
            if (!itemName || !collectionPath) {
                console.warn(`Invalid render-for expression: ${expression}`);
                return;
            }
            const collection = this.getNestedProperty(props, collectionPath);
            if (!collection) {
                el.remove();
                return;
            }
            this.renderCollection(el, collection, itemName, indexName || '', props);
        });
    }
    // Метод для парсинга for
    parseForExpression(expression) {
        // Нормализуем пробелы и удаляем лишние
        const normalized = expression.replace(/\s*,\s*/g, ',').trim();
        const parts = normalized.split(/\s+/).filter(Boolean);
        // Вариант 1: "(item,index) in collection"
        if (parts.length === 3 && parts[1] === 'in') {
            const match = parts[0].match(/^\((\w+),(\w+)\)$/);
            if (match) {
                return {
                    itemName: match[1],
                    indexName: match[2],
                    collectionPath: parts[2]
                };
            }
        }
        // Вариант 2: "item in collection"
        if (parts.length === 3 && parts[1] === 'in') {
            return {
                itemName: parts[0],
                collectionPath: parts[2]
            };
        }
        throw new Error(`Invalid render-for expression: ${expression}`);
    }
    renderCollection(templateEl, collection, itemName, indexName, parentProps) {
        const parent = templateEl.parentNode;
        const fragment = document.createDocumentFragment();
        const isArray = Array.isArray(collection);
        Object.entries(collection).forEach(([key, item], idx) => {
            const clone = templateEl.cloneNode(true);
            // Создаём полный контекст с данными
            const context = {
                ...parentProps,
                [itemName]: item,
                ...(indexName ? { [indexName]: isArray ? idx : key } : {}),
                $key: `${key}-${idx}`,
                $index: idx,
                $parent: parentProps
            };
            // Глубокая обработка клона
            this.processNode(clone, context);
            fragment.appendChild(clone);
        });
        parent.replaceChild(fragment, templateEl);
    }
    processNode(element, context) {
        // Обрабатываем атрибуты
        this.processElementAttributes(element, context);
        // Обрабатываем условные атрибуты
        this.processConditionalRendering(element, context);
        // Рекурсивно обрабатываем детей
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === Node.TEXT_NODE) {
                this.processTextNode(node, context);
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                this.processNode(node, context);
            }
        }
    }
    getNestedProperty(obj, path) {
        return path.split('.').reduce((acc, key) => {
            // Поддержка массивов: items.0.name
            const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
            if (arrayMatch && Array.isArray(acc?.[arrayMatch[1]])) {
                return acc[arrayMatch[1]][Number(arrayMatch[2])];
            }
            return acc?.[key];
        }, obj);
    }
}

/**
 * Валидирует блок по минимальной схеме.
 * @throws {Error} – Если блок невалиден.
 */
function validateBlock(block) {
    if (!block.type) {
        throw new Error('Block type is required');
    }
    if (typeof block.props !== 'object') {
        throw new Error('Block props must be an object');
    }
}

export { BlockManager, BlockRenderer, validateBlock };
