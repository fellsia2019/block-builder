import type { OptBlockModel, BlockManagerOptions } from './types';
import { defaultTypesBlocks } from './defaultTypesBlocks'

export class BlockManager {
    private blocks: OptBlockModel[] = [];
    private saveEndpoint?: string;
    private useDefaultTypesBlocks?: boolean = false;
    private registeredBlocks: Record<string, OptBlockModel> = {}

    constructor(initialBlocks: OptBlockModel[] = [], options: BlockManagerOptions = {}) {
        this.blocks = initialBlocks;
        this.saveEndpoint = options.saveEndpoint;
        this.useDefaultTypesBlocks = Boolean(options.useDefaultTypesBlocks)

        if (this.useDefaultTypesBlocks) {
            this.registeredBlocks = { ...defaultTypesBlocks }
        }
    }

    registerBlock(block: OptBlockModel): OptBlockModel {
        if (Object.hasOwn(this.registeredBlocks, block.type)) {
            throw new Error(`Блок с таким типом (type: ${block.type}) уже существует!`)
        }
        this.registeredBlocks[block.type] = block
        return block;
    }

    addBlock(type: string, props?: Record<string, unknown>): OptBlockModel {
        if (!Object.hasOwn(this.registeredBlocks, type)) {
            throw new Error(`Блок с таким типом (type: ${type}) не зарегистрирован!`)
        }
        
        // возможно нужно сделать глупокое копирование
        const block = { ...this.registeredBlocks[type] }

        if (!block.id) {
            block.id = `block-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }
        if (props) {
            block.props = props
        }

        this.blocks.push(block);
        return block;
    }

    editBlock(index: number, props: Record<string, unknown>): OptBlockModel {
        if (index < 0 || index > this.blocks.length) {
            throw new Error(`Некорректный index: ${index}`)
        }

        const block = this.blocks[index]
        block.props = props

        this.blocks = [...this.blocks.slice(0, index), block, ...this.blocks.slice(index + 1)]
        return block;
    }

    removeBlock(id: string): void {
        this.blocks = this.blocks.filter(block => block.id !== id);
    }

    getBlocks(): OptBlockModel[] {
        return this.blocks;
    }

    getRegisteredBlocks(): Record<string, OptBlockModel> {
        return this.registeredBlocks
    }

    async save(): Promise<void> {
        if (!this.saveEndpoint) {
            throw new Error('Save endpoint is not defined');
        }
        await fetch(this.saveEndpoint, {
            method: 'POST',
            body: JSON.stringify(this.blocks),
        });
    }
}