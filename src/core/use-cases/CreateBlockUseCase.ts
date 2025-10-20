import { IBlockDto, ICreateBlockDto } from '../dto/BlockDto';
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

    // Генерация уникального ID
    const blockId = this.generateBlockId();

    // Создание блока с метаданными
    const blockDataWithId: ICreateBlockDto = {
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

  private validateBlockData(blockData: ICreateBlockDto): void {
    if (!blockData.type || typeof blockData.type !== 'string') {
      throw new Error('Block type is required and must be a string');
    }

    // Допускаем два сценария отображения:
    // 1) HTML template, предоставляемый конфигурацией UI, может не храниться в блоке
    // 2) Vue компонент (имя компонента) — достаточно поля component/componentProps
    // Поэтому не требуем наличия template в DTO

  }

  private generateBlockId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
