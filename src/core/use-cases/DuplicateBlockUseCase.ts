import { BlockDto, CreateBlockDto } from '../dto/BlockDto';
import { BlockRepository } from '../ports/BlockRepository';

/**
 * Use Case: Дублирование блока
 * Инкапсулирует бизнес-логику дублирования блока
 */
export class DuplicateBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async execute(blockId: string): Promise<BlockDto | null> {
    // Получение исходного блока
    const originalBlock = await this.blockRepository.getById(blockId);
    if (!originalBlock) {
      return null;
    }

    // Создание дубликата
    const duplicatedBlock = this.createDuplicate(originalBlock);

    // Сохранение дубликата
    const createdBlock = await this.blockRepository.create(duplicatedBlock);

    // Дублирование дочерних блоков
    await this.duplicateChildren(originalBlock.id, createdBlock.id);

    return createdBlock;
  }

  private createDuplicate(originalBlock: BlockDto): CreateBlockDto {
    return {
      type: originalBlock.type,
      settings: { ...originalBlock.settings },
      props: { ...originalBlock.props },
      style: originalBlock.style ? { ...originalBlock.style } : undefined,
      template: originalBlock.template,
      parent: originalBlock.parent,
      visible: originalBlock.visible,
      locked: false, // Дубликат не заблокирован
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    };
  }

  private async duplicateChildren(originalParentId: string, newParentId: string): Promise<void> {
    const children = await this.blockRepository.getChildren(originalParentId);
    
    for (const child of children) {
      // Создаем дубликат дочернего блока
      const duplicatedChild = this.createDuplicate(child);
      duplicatedChild.parent = newParentId;
      
      // Сохраняем дубликат
      const createdChild = await this.blockRepository.create(duplicatedChild);
      
      // Рекурсивно дублируем дочерние блоки
      await this.duplicateChildren(child.id, createdChild.id);
    }
  }
}