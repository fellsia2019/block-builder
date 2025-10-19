import { BlockDto, CreateBlockDto, UpdateBlockDto } from '../../core/dto/BlockDto';
import { BlockRepository } from '../../core/ports/BlockRepository';

/**
 * Реализация репозитория блоков в памяти
 * Реализует порт BlockRepository
 */
export class MemoryBlockRepositoryImpl implements BlockRepository {
  private blocks: Map<string, BlockDto> = new Map();

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

    this.blocks.set(id, block);
    return { ...block };
  }

  async getById(id: string): Promise<BlockDto | null> {
    const block = this.blocks.get(id);
    return block ? { ...block } : null;
  }

  async getAll(): Promise<BlockDto[]> {
    return Array.from(this.blocks.values()).map(block => ({ ...block }));
  }

  async getByType(type: string): Promise<BlockDto[]> {
    return Array.from(this.blocks.values())
      .filter(block => block.type === type)
      .map(block => ({ ...block }));
  }

  async getChildren(parentId: string): Promise<BlockDto[]> {
    return Array.from(this.blocks.values())
      .filter(block => block.parent === parentId)
      .map(block => ({ ...block }));
  }

  async update(id: string, updates: UpdateBlockDto): Promise<BlockDto> {
    const existingBlock = this.blocks.get(id);
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

    this.blocks.set(id, updatedBlock);
    return { ...updatedBlock };
  }

  async delete(id: string): Promise<boolean> {
    return this.blocks.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.blocks.has(id);
  }

  async count(): Promise<number> {
    return this.blocks.size;
  }

  async clear(): Promise<void> {
    this.blocks.clear();
  }

  private generateId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
