import { BlockDto, CreateBlockDto, UpdateBlockDto } from '../../core/dto/BlockDto';
import { BlockRepository } from '../../core/ports/BlockRepository';

/**
 * Реализация репозитория блоков с использованием LocalStorage
 * Реализует порт BlockRepository
 */
export class LocalStorageBlockRepositoryImpl implements BlockRepository {
  private readonly storageKey = 'naberika_blocks';

  private getBlocksFromStorage(): Map<string, BlockDto> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return new Map();
      
      const blocksArray = JSON.parse(stored) as BlockDto[];
      return new Map(blocksArray.map(block => [block.id, block]));
    } catch (error) {
      console.error('Error loading blocks from localStorage:', error);
      return new Map();
    }
  }

  private saveBlocksToStorage(blocks: Map<string, BlockDto>): void {
    try {
      const blocksArray = Array.from(blocks.values());
      localStorage.setItem(this.storageKey, JSON.stringify(blocksArray));
    } catch (error) {
      console.error('Error saving blocks to localStorage:', error);
    }
  }

  async create(blockData: CreateBlockDto): Promise<BlockDto> {
    const id = this.generateId();
    const block: BlockDto = {
      id,
      ...blockData,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        ...blockData.metadata
      }
    };

    const blocks = this.getBlocksFromStorage();
    blocks.set(id, block);
    this.saveBlocksToStorage(blocks);
    
    return { ...block };
  }

  async getById(id: string): Promise<BlockDto | null> {
    const blocks = this.getBlocksFromStorage();
    const block = blocks.get(id);
    return block ? { ...block } : null;
  }

  async getAll(): Promise<BlockDto[]> {
    const blocks = this.getBlocksFromStorage();
    return Array.from(blocks.values()).map(block => ({ ...block }));
  }

  async getByType(type: string): Promise<BlockDto[]> {
    const blocks = this.getBlocksFromStorage();
    return Array.from(blocks.values())
      .filter(block => block.type === type)
      .map(block => ({ ...block }));
  }

  async getChildren(parentId: string): Promise<BlockDto[]> {
    const blocks = this.getBlocksFromStorage();
    return Array.from(blocks.values())
      .filter(block => block.parent === parentId)
      .map(block => ({ ...block }));
  }

  async update(id: string, updates: UpdateBlockDto): Promise<BlockDto> {
    const blocks = this.getBlocksFromStorage();
    const existingBlock = blocks.get(id);
    
    if (!existingBlock) {
      throw new Error(`Block with id ${id} not found`);
    }

    const updatedBlock: BlockDto = {
      ...existingBlock,
      ...updates,
      style: updates.style ? { ...existingBlock.style, ...updates.style } as Record<string, string | number> : existingBlock.style,
      metadata: {
        ...existingBlock.metadata!,
        updatedAt: new Date(),
        version: (existingBlock.metadata?.version || 1) + 1
      }
    };

    blocks.set(id, updatedBlock);
    this.saveBlocksToStorage(blocks);
    
    return { ...updatedBlock };
  }

  async delete(id: string): Promise<boolean> {
    const blocks = this.getBlocksFromStorage();
    const deleted = blocks.delete(id);
    this.saveBlocksToStorage(blocks);
    return deleted;
  }

  async exists(id: string): Promise<boolean> {
    const blocks = this.getBlocksFromStorage();
    return blocks.has(id);
  }

  async count(): Promise<number> {
    const blocks = this.getBlocksFromStorage();
    return blocks.size;
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }

  private generateId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
