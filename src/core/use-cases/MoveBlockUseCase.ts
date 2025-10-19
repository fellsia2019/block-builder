import { BlockDto } from '../dto/BlockDto';
import { BlockRepository } from '../ports/BlockRepository';

/**
 * Use Case: Перемещение блока
 * Инкапсулирует бизнес-логику перемещения блока
 */
export class MoveBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async execute(blockId: string, newPosition: { x: number; y: number; z?: number }): Promise<BlockDto | null> {
    // Получение блока
    const block = await this.blockRepository.getById(blockId);
    if (!block) {
      return null;
    }

    // Проверка возможности перемещения
    if (block.locked) {
      throw new Error('Cannot move locked block');
    }

    // Валидация позиции
    this.validatePosition(newPosition);

    // Обновление позиции
    const updatedBlock = await this.blockRepository.update(blockId, { position: newPosition });

    return updatedBlock;
  }

  private validatePosition(position: { x: number; y: number; z?: number }): void {
    if (position.x < 0 || position.y < 0) {
      throw new Error('Position coordinates must be non-negative');
    }

    if (isNaN(position.x) || isNaN(position.y)) {
      throw new Error('Position coordinates must be valid numbers');
    }

    if (position.z !== undefined && (position.z < 0 || isNaN(position.z))) {
      throw new Error('Z-index must be non-negative number if provided');
    }
  }
}