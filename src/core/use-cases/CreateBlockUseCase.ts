import { IBlockDto, ICreateBlockDto } from '../types';
import { IBlockRepository } from '../ports/BlockRepository';

/**
 * Use Case: Создание нового блока
 * Инкапсулирует бизнес-логику создания блока
 */
export class CreateBlockUseCase {
  constructor(private blockRepository: IBlockRepository) {}

  async execute(blockData: ICreateBlockDto): Promise<IBlockDto> {
    // Валидация входных данных
    this.validateBlockData(blockData);

    // Создание блока с метаданными (ID генерируется в репозитории)
    const blockDataWithMetadata: ICreateBlockDto = {
      ...blockData,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    };

    // Сохранение в репозитории (репозиторий генерирует ID)
    const createdBlock = await this.blockRepository.create(blockDataWithMetadata);

    return createdBlock;
  }

  private validateBlockData(blockData: ICreateBlockDto): void {
    if (!blockData.type || typeof blockData.type !== 'string') {
      throw new Error('Block type is required and must be a string');
    }

    // Допускаем различные сценарии отображения через render:
    // 1) HTML template (kind: 'html')
    // 2) Vue/React компонент (kind: 'component')
    // 3) Внешний адаптер (kind: 'external')
    // Поэтому не требуем наличия render в DTO

  }

}
