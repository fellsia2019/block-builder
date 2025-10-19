import { BlockDto, UpdateBlockDto } from '../dto/BlockDto';
import { BlockRepository } from '../ports/BlockRepository';

/**
 * Use Case: Обновление блока
 * Инкапсулирует бизнес-логику обновления блока
 */
export class UpdateBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async execute(
    blockId: string, 
    updates: UpdateBlockDto
  ): Promise<BlockDto | null> {
    // Получение существующего блока
    const existingBlock = await this.blockRepository.getById(blockId);
    if (!existingBlock) {
      return null;
    }

    // Валидация обновлений
    this.validateUpdates(updates);

    // Обновление блока через репозиторий
    const updatedBlock = await this.blockRepository.update(blockId, updates);

    return updatedBlock;
  }

  private validateUpdates(updates: UpdateBlockDto): void {
    if (updates.settings) {
      this.validateSettings(updates.settings);
    }

    if (updates.props) {
      this.validateProps(updates.props);
    }

    if (updates.style) {
      this.validateStyle(updates.style);
    }
  }

  private validateSettings(settings: Partial<Record<string, any>>): void {
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        throw new Error(`Invalid setting value for key '${key}': must be primitive type`);
      }
    });
  }

  private validateProps(props: Partial<Record<string, any>>): void {
    Object.entries(props).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        throw new Error(`Invalid prop value for key '${key}': must be primitive type`);
      }
    });
  }

  private validateStyle(style: Partial<Record<string, string | number>>): void {
    Object.entries(style).forEach(([key, value]) => {
      if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error(`Invalid style value for key '${key}': must be string or number`);
      }
    });
  }
}
