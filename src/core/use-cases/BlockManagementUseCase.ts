import { BlockDto, CreateBlockDto, UpdateBlockDto } from '../dto/BlockDto';
import { BlockRepository } from '../ports/BlockRepository';
import { CreateBlockUseCase } from './CreateBlockUseCase';
import { UpdateBlockUseCase } from './UpdateBlockUseCase';
import { DeleteBlockUseCase } from './DeleteBlockUseCase';
import { MoveBlockUseCase } from './MoveBlockUseCase';
import { DuplicateBlockUseCase } from './DuplicateBlockUseCase';

/**
 * Главный Use Case для управления блоками
 * Единственный вход в ядро приложения
 */
export class BlockManagementUseCase {
  private createBlockUseCase: CreateBlockUseCase;
  private updateBlockUseCase: UpdateBlockUseCase;
  private deleteBlockUseCase: DeleteBlockUseCase;
  private moveBlockUseCase: MoveBlockUseCase;
  private duplicateBlockUseCase: DuplicateBlockUseCase;

  constructor(private blockRepository: BlockRepository) {
    this.createBlockUseCase = new CreateBlockUseCase(blockRepository);
    this.updateBlockUseCase = new UpdateBlockUseCase(blockRepository);
    this.deleteBlockUseCase = new DeleteBlockUseCase(blockRepository);
    this.moveBlockUseCase = new MoveBlockUseCase(blockRepository);
    this.duplicateBlockUseCase = new DuplicateBlockUseCase(blockRepository);
  }

  /**
   * Создание нового блока
   */
  async createBlock(blockData: CreateBlockDto): Promise<BlockDto> {
    return this.createBlockUseCase.execute(blockData);
  }

  /**
   * Получение блока по ID
   */
  async getBlock(blockId: string): Promise<BlockDto | null> {
    return this.blockRepository.getById(blockId);
  }

  /**
   * Получение всех блоков
   */
  async getAllBlocks(): Promise<BlockDto[]> {
    return this.blockRepository.getAll();
  }

  /**
   * Обновление блока
   */
  async updateBlock(blockId: string, updates: UpdateBlockDto): Promise<BlockDto | null> {
    return this.updateBlockUseCase.execute(blockId, updates);
  }

  /**
   * Перемещение блока
   */
  async moveBlock(blockId: string, position: { x: number; y: number; z?: number }): Promise<BlockDto | null> {
    return this.moveBlockUseCase.execute(blockId, position);
  }

  /**
   * Изменение размера блока
   */
  async resizeBlock(blockId: string, size: { width: number; height: number }): Promise<BlockDto | null> {
    return this.updateBlockUseCase.execute(blockId, { 
      size: { width: size.width, height: size.height }
    });
  }

  /**
   * Удаление блока
   */
  async deleteBlock(blockId: string): Promise<boolean> {
    return this.deleteBlockUseCase.execute(blockId);
  }

  /**
   * Дублирование блока
   */
  async duplicateBlock(blockId: string): Promise<BlockDto | null> {
    return this.duplicateBlockUseCase.execute(blockId);
  }

  /**
   * Блокировка/разблокировка блока
   */
  async setBlockLocked(blockId: string, locked: boolean): Promise<BlockDto | null> {
    return this.updateBlockUseCase.execute(blockId, { locked });
  }

  /**
   * Показ/скрытие блока
   */
  async setBlockVisible(blockId: string, visible: boolean): Promise<BlockDto | null> {
    return this.updateBlockUseCase.execute(blockId, { visible });
  }

  /**
   * Получение блоков по типу
   */
  async getBlocksByType(type: string): Promise<BlockDto[]> {
    return this.blockRepository.getByType(type);
  }

  /**
   * Получение дочерних блоков
   */
  async getChildBlocks(parentId: string): Promise<BlockDto[]> {
    return this.blockRepository.getChildren(parentId);
  }

  /**
   * Переупорядочивание блоков
   */
  async reorderBlocks(blockIds: string[]): Promise<boolean> {
    try {
      const blocks = await this.getAllBlocks();
      const blockMap = new Map(blocks.map(block => [block.id, block]));
      
      // Обновляем порядок блоков
      for (let i = 0; i < blockIds.length; i++) {
        const block = blockMap.get(blockIds[i]);
        if (block) {
          await this.blockRepository.update(block.id, {});
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering blocks:', error);
      return false;
    }
  }
}