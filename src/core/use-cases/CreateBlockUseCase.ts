import { BlockDto, CreateBlockDto } from '../dto/BlockDto';
import { BlockRepository } from '../ports/BlockRepository';

/**
 * Use Case: Создание нового блока
 * Инкапсулирует бизнес-логику создания блока
 */
export class CreateBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async execute(blockData: CreateBlockDto): Promise<BlockDto> {
    // Валидация входных данных
    this.validateBlockData(blockData);

    // Генерация уникального ID
    const blockId = this.generateBlockId();

    // Создание блока с метаданными
    const blockDataWithId: CreateBlockDto = {
      ...blockData,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    };

    // Сохранение в репозитории
    const createdBlock = await this.blockRepository.create(blockDataWithId);

    return createdBlock;
  }

  private validateBlockData(blockData: CreateBlockDto): void {
    if (!blockData.type || typeof blockData.type !== 'string') {
      throw new Error('Block type is required and must be a string');
    }

    if (!blockData.template) {
      throw new Error('Block template is required');
    }

    if (blockData.position && (blockData.position.x < 0 || blockData.position.y < 0)) {
      throw new Error('Block position must be non-negative');
    }

    if (blockData.size && (blockData.size.width <= 0 || blockData.size.height <= 0)) {
      throw new Error('Block size must be positive');
    }
  }

  private generateBlockId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
