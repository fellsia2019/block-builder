import { IBlockRepository } from '../ports/BlockRepository';

/**
 * Use Case: Удаление блока
 * Инкапсулирует бизнес-логику удаления блока
 */
export class DeleteBlockUseCase {
  constructor(private blockRepository: IBlockRepository) {}

  async execute(blockId: string): Promise<boolean> {
    // Проверка существования блока
    const block = await this.blockRepository.getById(blockId);
    if (!block) {
      return false;
    }

    // Проверка возможности удаления
    if (block.locked) {
      throw new Error('Cannot delete locked block');
    }

    // Удаление дочерних блоков (рекурсивно)
    await this.deleteChildrenRecursively(blockId);

    // Удаление самого блока
    await this.blockRepository.delete(blockId);

    return true;
  }

  private async deleteChildrenRecursively(parentId: string): Promise<void> {
    const children = await this.blockRepository.getChildren(parentId);
    
    for (const child of children) {
      // Рекурсивно удаляем дочерние блоки
      await this.deleteChildrenRecursively(child.id);
      
      // Удаляем дочерний блок
      await this.blockRepository.delete(child.id);
    }
  }
}