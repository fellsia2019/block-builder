/**
 * DTO для передачи данных блока
 * Содержит только данные, без бизнес-логики
 */

import { IFormGenerationConfig } from '../entities/ValidationRule';

export interface IBlockDto {
  id: string;
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  style?: Record<string, string | number>;
  order?: number; // Порядок блока в списке
  template?: string; // Строковый шаблон (для HTML)
  component?: string; // Имя Vue3 компонента
  componentProps?: Record<string, any>; // Пропсы для Vue3 компонента
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

export interface ICreateBlockDto {
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  style?: Record<string, string | number>;
  order?: number; // Порядок блока в списке
  template?: string; // Строковый шаблон (для HTML)
  component?: string; // Имя Vue3 компонента
  componentProps?: Record<string, any>; // Пропсы для Vue3 компонента
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

export interface IUpdateBlockDto {
  settings?: Partial<Record<string, any>>;
  props?: Partial<Record<string, any>>;
  style?: Partial<Record<string, string | number>>;
  order?: number; // Порядок блока в списке
  template?: string; // Строковый шаблон (для HTML)
  component?: string; // Имя Vue3 компонента
  componentProps?: Record<string, any>; // Пропсы для Vue3 компонента
  visible?: boolean;
  locked?: boolean;
  formConfig?: IFormGenerationConfig; // Конфигурация для автогенерации форм
}

export interface IBlockListDto {
  blocks: IBlockDto[];
  total: number;
  page?: number;
  limit?: number;
}
