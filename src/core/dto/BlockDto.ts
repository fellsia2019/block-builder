/**
 * DTO для передачи данных блока
 * Содержит только данные, без бизнес-логики
 */

export interface BlockDto {
  id: string;
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  style?: Record<string, string | number>;
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  size?: {
    width: number;
    height: number;
  };
  template: string;
  children?: string[]; // IDs дочерних блоков
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
  };
}

export interface CreateBlockDto {
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  style?: Record<string, string | number>;
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  size?: {
    width: number;
    height: number;
  };
  template: string;
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
  };
}

export interface UpdateBlockDto {
  settings?: Partial<Record<string, any>>;
  props?: Partial<Record<string, any>>;
  style?: Partial<Record<string, string | number>>;
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  size?: {
    width: number;
    height: number;
  };
  visible?: boolean;
  locked?: boolean;
}

export interface BlockListDto {
  blocks: BlockDto[];
  total: number;
  page?: number;
  limit?: number;
}
