import { BlockDto } from '../dto/BlockDto';

// Типы для сущности
export type BlockId = string;
export interface BlockSettings {
  [key: string]: any;
}
export interface BlockProps {
  [key: string]: any;
}
export interface BlockStyle {
  [key: string]: string | number;
}
export interface BlockPosition {
  x: number;
  y: number;
  z?: number;
}
export interface BlockSize {
  width: number;
  height: number;
}
export interface Block {
  id: BlockId;
  type: string;
  settings: BlockSettings;
  props: BlockProps;
  style?: BlockStyle;
  position?: BlockPosition;
  size?: BlockSize;
  template: string;
  children?: Block[];
  parent?: BlockId;
  visible?: boolean;
  locked?: boolean;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
  };
}

/**
 * Доменная сущность блока
 * Содержит бизнес-логику для работы с блоками
 */
export class BlockEntity {
  private _block: Block;

  constructor(block: Block) {
    this._block = { ...block };
  }

  get id(): BlockId {
    return this._block.id;
  }

  get type(): string {
    return this._block.type;
  }

  get settings(): BlockSettings {
    return { ...this._block.settings };
  }

  get props(): BlockProps {
    return { ...this._block.props };
  }

  get style(): BlockStyle | undefined {
    return this._block.style ? { ...this._block.style } : undefined;
  }

  get position(): BlockPosition | undefined {
    return this._block.position ? { ...this._block.position } : undefined;
  }

  get size(): BlockSize | undefined {
    return this._block.size ? { ...this._block.size } : undefined;
  }

  get template(): string | HTMLElement {
    return this._block.template;
  }

  get children(): Block[] {
    return this._block.children ? [...this._block.children] : [];
  }

  get parent(): BlockId | undefined {
    return this._block.parent;
  }

  get visible(): boolean {
    return this._block.visible ?? true;
  }

  get locked(): boolean {
    return this._block.locked ?? false;
  }

  get metadata() {
    return this._block.metadata;
  }

  /**
   * Обновляет настройки блока
   */
  updateSettings(settings: Partial<BlockSettings>): void {
    this._block.settings = { ...this._block.settings, ...settings };
    this._updateMetadata();
  }

  /**
   * Обновляет свойства блока
   */
  updateProps(props: Partial<BlockProps>): void {
    this._block.props = { ...this._block.props, ...props };
    this._updateMetadata();
  }

  /**
   * Обновляет стили блока
   */
  updateStyle(style: Partial<BlockStyle>): void {
    this._block.style = { ...this._block.style, ...style } as BlockStyle;
    this._updateMetadata();
  }

  /**
   * Перемещает блок
   */
  moveTo(position: BlockPosition): void {
    this._block.position = { ...position };
    this._updateMetadata();
  }

  /**
   * Изменяет размер блока
   */
  resize(size: BlockSize): void {
    this._block.size = { ...size };
    this._updateMetadata();
  }

  /**
   * Блокирует/разблокирует блок
   */
  setLocked(locked: boolean): void {
    this._block.locked = locked;
    this._updateMetadata();
  }

  /**
   * Показывает/скрывает блок
   */
  setVisible(visible: boolean): void {
    this._block.visible = visible;
    this._updateMetadata();
  }

  /**
   * Добавляет дочерний блок
   */
  addChild(child: Block): void {
    if (!this._block.children) {
      this._block.children = [];
    }
    this._block.children.push(child);
    this._updateMetadata();
  }

  /**
   * Удаляет дочерний блок
   */
  removeChild(childId: BlockId): boolean {
    if (!this._block.children) return false;
    
    const index = this._block.children.findIndex(child => child.id === childId);
    if (index === -1) return false;
    
    this._block.children.splice(index, 1);
    this._updateMetadata();
    return true;
  }

  /**
   * Проверяет, является ли блок дочерним для данного
   */
  hasChild(childId: BlockId): boolean {
    return this._block.children?.some(child => child.id === childId) ?? false;
  }

  /**
   * Проверяет, можно ли редактировать блок
   */
  canEdit(): boolean {
    return !this.locked && this.visible;
  }

  /**
   * Проверяет, можно ли удалить блок
   */
  canDelete(): boolean {
    return !this.locked;
  }

  /**
   * Клонирует блок с новым ID
   */
  clone(newId: BlockId): BlockEntity {
    const clonedBlock: Block = {
      ...this._block,
      id: newId,
      children: this._block.children?.map(child => ({ ...child })),
      metadata: {
        ...this._block.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    };
    
    return new BlockEntity(clonedBlock);
  }

  /**
   * Возвращает сериализованный блок
   */
  toJSON(): Block {
    return { ...this._block };
  }

  /**
   * Обновляет метаданные
   */
  private _updateMetadata(): void {
    if (!this._block.metadata) {
      this._block.metadata = {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      };
    } else {
      this._block.metadata.updatedAt = new Date();
      this._block.metadata.version += 1;
    }
  }
}
