import { BlockManager } from './BlockManager';
import type { BlockModel } from './types';

// key - string as type block
// value - string as HTMLString template
type BlockRendererMap = Record<string, string>;

export class BlockRenderer {
    constructor(
        private manager: BlockManager,
        private renderers: BlockRendererMap
    ) {
        this.manager = manager
    }

    renderTo(container: HTMLElement) {
        container.innerHTML = '';
        this.manager.getBlocks().forEach(block => {
            const element = this.createFallbackBlock(block);
            container.appendChild(element);
        });
    }

    private createFallbackBlock(block: BlockModel): HTMLElement {
        const renderBoilerplate = this.renderers[block.type]
        let renderBlock = this.renderTemplate(renderBoilerplate, block)

        // найти в renderBoilerplate все вхождения по шаблону [[key]] и заменить на innerHTML из block.props[key]
        const div = document.createElement('div');
        div.classList.add('bb-section-block')
        div.innerHTML = renderBlock;
        return div;
    }

    private renderTemplate(template: string, data: { props: Record<string, any> }): string {
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

    private processConditionalRendering(element: Element, props: any) {
        // Ищем все элементы с render-if
        const elements = element.querySelectorAll('[render-if]');
        
        elements.forEach(el => {
            const condition = el.getAttribute('render-if')!;
            el.removeAttribute('render-if');
            
            if (!this.evaluateCondition(props, condition)) {
                el.remove();
            }
        });
    }

    private processTemplateExpressions(element: Element, props: any) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            null,
        );
        
        while (walker.nextNode()) {
            const node = walker.currentNode;
            
            if (node.nodeType === Node.TEXT_NODE) {
                this.processTextNode(node as Text, props);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                this.processElementAttributes(node as Element, props);
            }
        }
    }

    private processTextNode(node: Text, context: any) {
        const newValue = node.nodeValue!.replace(
            /\[\[\s*([^\]]+?)\s*\]\]/g,
            (_, expr) => this.evaluateExpression(expr, context)
        );
        
        if (newValue !== node.nodeValue) {
            node.nodeValue = newValue;
        }
    }

    private evaluateExpression(expr: string, context: any): string {
        try {
            // Создаём безопасный контекст для eval
            const sandbox = { 
                ...context,
                Math: Math, 
                Date: Date,
                JSON: JSON
            };
            
            const value = new Function(
                ...Object.keys(sandbox),
                `return ${expr}`
            )(...Object.values(sandbox));
            
            if (value === undefined || value === null) return '';
            if (typeof value === 'object') return JSON.stringify(value, null, 2);
            return String(value);
        } catch (e) {
            console.warn(`Error evaluating expression "${expr}":`, e);
            return '';
        }
    }

    private processElementAttributes(element: Element, props: any) {
        Array.from(element.attributes).forEach(attr => {
            if (attr.value.includes('[[')) {
                element.setAttribute(
                    attr.name,
                    attr.value.replace(
                        /\[\[\s*([^\]]+?)\s*\]\]/g,
                        (_, key) => this.getPropertyValue(props, key)
                    )
                );
            }
        });
    }

    private getPropertyValue(props: any, key: string): string {
        const value = key.split('.').reduce((obj, k) => obj?.[k], props);
        
        if (value === undefined || value === null) return '';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    }

    private evaluateCondition(props: any, condition: string): boolean {
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

    private processForDirectives(element: Element, props: any) {
        const forElements = Array.from(element.querySelectorAll('[render-for]'));
        
        forElements.forEach(el => {
            const expression = el.getAttribute('render-for')!;
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

            this.renderCollection(
                el,
                collection,
                itemName,
                indexName || '',
                props
            );
        });
    }

    // Метод для парсинга for
    private parseForExpression(expression: string): {
        itemName: string;
        indexName?: string;
        collectionPath: string;
    } {
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

    private renderCollection(
        templateEl: Element,
        collection: any[] | object,
        itemName: string,
        indexName?: string,
        parentProps?: any
    ) {
        const parent = templateEl.parentNode!;
        const fragment = document.createDocumentFragment();
        const isArray = Array.isArray(collection);

        Object.entries(collection).forEach(([key, item], idx) => {
            const clone = templateEl.cloneNode(true) as Element;
            
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

    private processNode(element: Element, context: any) {
        // Обрабатываем атрибуты
        this.processElementAttributes(element, context);
        
        // Обрабатываем условные атрибуты
        this.processConditionalRendering(element, context);
        
        // Рекурсивно обрабатываем детей
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            null
        );
        
        while (walker.nextNode()) {
            const node = walker.currentNode;
            
            if (node.nodeType === Node.TEXT_NODE) {
                this.processTextNode(node as Text, context);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                this.processNode(node as Element, context);
            }
        }
    }

    private getNestedProperty(obj: any, path: string): any {
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