'use strict';

/**
 * Базовый тип блока.
 * @property {string} id – Уникальный идентификатор (генерируется на клиенте).
 * @property {string} type – Тип блока ('text', 'image', 'slider').
 * @property {Record<string, unknown>} props – Динамические свойства блока.
 */
var BlockModelFormItemTypeField;
(function (BlockModelFormItemTypeField) {
    BlockModelFormItemTypeField["TEXT"] = "text";
    BlockModelFormItemTypeField["IMAGE"] = "image";
    BlockModelFormItemTypeField["EACH_ARRAY"] = "each-array";
    BlockModelFormItemTypeField["EACH_OBJECT"] = "each-object";
})(BlockModelFormItemTypeField || (BlockModelFormItemTypeField = {}));

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
        props: { text: '' },
        form: {
            text: {
                typeField: BlockModelFormItemTypeField.TEXT,
                placeholder: ''
            }
        }
    },
    [DEFAULT_TYPES['BB_TEXT_IMG_BLOCK']]: {
        id: '',
        type: DEFAULT_TYPES['BB_TEXT_IMG_BLOCK'],
        name: 'Текст с изображением',
        props: { text: '', img: '' },
        form: {
            text: {
                typeField: BlockModelFormItemTypeField.TEXT,
                placeholder: ''
            },
            img: {
                typeField: BlockModelFormItemTypeField.IMAGE,
                placeholder: ''
            }
        }
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
        // возможно нужно сделать глупокое копирование
        const block = { ...this.registeredBlocks[type] };
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
    moveNextBlock(index) {
        if (index === this.blocks?.length - 1) {
            return;
        }
        const originalBLock = this.blocks[index];
        const nextBlock = this.blocks[index + 1];
        const leftItems = index === 0 ? [] : this.blocks.slice(0, index);
        const rightItems = this.blocks.slice(index + 2);
        const leftPart = [...(leftItems || [])];
        if (nextBlock) {
            leftPart.push(nextBlock);
        }
        this.blocks = [...leftPart, originalBLock, ...(rightItems || [])];
    }
    movePrevBlock(index) {
        if (index === 0) {
            return;
        }
        const originalBLock = this.blocks[index];
        const prevBlock = this.blocks[index - 1];
        const leftItems = this.blocks.slice(0, index - 1);
        const rightItems = this.blocks.slice(index + 1);
        const leftPart = [...(leftItems || []), originalBLock];
        if (prevBlock) {
            leftPart.push(prevBlock);
        }
        this.blocks = [...leftPart, ...(rightItems || [])];
    }
    getBlocks() {
        return this.blocks;
    }
    getRegisteredBlocks() {
        return this.registeredBlocks;
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

exports.BlockManager = BlockManager;
exports.validateBlock = validateBlock;
