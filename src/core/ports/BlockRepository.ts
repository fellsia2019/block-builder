import { BlockDto, CreateBlockDto, UpdateBlockDto, BlockListDto } from '../dto/BlockDto';

/**
 * Port (интерфейс) для работы с блоками
 * Определяет контракт для внешнего мира
 */
export interface BlockRepository {
  /**
   * Создать блок
   */
  create(blockData: CreateBlockDto): Promise<BlockDto>;

  /**
   * Получить блок по ID
   */
  getById(id: string): Promise<BlockDto | null>;

  /**
   * Получить все блоки
   */
  getAll(): Promise<BlockDto[]>;

  /**
   * Получить блоки по типу
   */
  getByType(type: string): Promise<BlockDto[]>;

  /**
   * Получить дочерние блоки
   */
  getChildren(parentId: string): Promise<BlockDto[]>;

  /**
   * Обновить блок
   */
  update(id: string, updates: UpdateBlockDto): Promise<BlockDto>;

  /**
   * Удалить блок
   */
  delete(id: string): Promise<boolean>;

  /**
   * Проверить существование блока
   */
  exists(id: string): Promise<boolean>;

  /**
   * Получить количество блоков
   */
  count(): Promise<number>;

  /**
   * Очистить все блоки
   */
  clear(): Promise<void>;
}
