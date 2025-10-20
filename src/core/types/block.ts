/**
 * Типы для работы с блоками
 */

import { TBlockId, TRenderRef } from './common';
import { IFormGenerationConfig } from './form';

// Интерфейсы для настроек и свойств блоков
export interface IBlockSettings {
  [key: string]: any;
}

export interface IBlockProps {
  [key: string]: any;
}

export interface IBlockStyle {
  [key: string]: string | number;
}

// Основной интерфейс блока (доменная модель)
export interface IBlock {
  id: TBlockId;
  type: string;
  settings: IBlockSettings;
  props: IBlockProps;
  style?: IBlockStyle;
  render?: TRenderRef; // Универсальная ссылка на способ рендера
  children?: IBlock[];
  parent?: TBlockId;
  visible?: boolean;
  locked?: boolean;
  formConfig?: IFormGenerationConfig; // Конфигурация для автогенерации форм
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
  };
}

// DTO для передачи данных блока (без бизнес-логики)
export interface IBlockDto {
  id: string;
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  style?: Record<string, string | number>;
  order?: number; // Порядок блока в списке
  render?: TRenderRef; // Универсальная ссылка на способ рендера
  children?: string[]; // IDs дочерних блоков
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  formConfig?: IFormGenerationConfig; // Конфигурация для автогенерации форм
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
  };
}

// DTO для создания блока
export interface ICreateBlockDto {
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  style?: Record<string, string | number>;
  order?: number; // Порядок блока в списке
  render?: TRenderRef; // Универсальная ссылка на способ рендера
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  formConfig?: IFormGenerationConfig; // Конфигурация для автогенерации форм
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
  };
}

// DTO для обновления блока
export interface IUpdateBlockDto {
  settings?: Partial<Record<string, any>>;
  props?: Partial<Record<string, any>>;
  style?: Partial<Record<string, string | number>>;
  order?: number; // Порядок блока в списке
  render?: TRenderRef; // Универсальная ссылка на способ рендера
  visible?: boolean;
  locked?: boolean;
  formConfig?: IFormGenerationConfig; // Конфигурация для автогенерации форм
}

// DTO для списка блоков
export interface IBlockListDto {
  blocks: IBlockDto[];
  total: number;
  page?: number;
  limit?: number;
}

// Типы для утилит
export type TBlock = IBlockDto;
// Дерево блоков для иерархического представления (дети как узлы)
export type TBlockWithChildren = Omit<IBlockDto, 'children'> & { children: TBlockWithChildren[] };
