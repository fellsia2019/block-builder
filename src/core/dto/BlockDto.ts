/**
 * DTO для передачи данных блока
 * Содержит только данные, без бизнес-логики
 */

import { FormGenerationConfig } from '../entities/ValidationRule';

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
  template?: string; // Строковый шаблон (для HTML)
  component?: string; // Имя Vue3 компонента
  componentProps?: Record<string, any>; // Пропсы для Vue3 компонента
  children?: string[]; // IDs дочерних блоков
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  formConfig?: FormGenerationConfig; // Конфигурация для автогенерации форм
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
  template?: string; // Строковый шаблон (для HTML)
  component?: string; // Имя Vue3 компонента
  componentProps?: Record<string, any>; // Пропсы для Vue3 компонента
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  formConfig?: FormGenerationConfig; // Конфигурация для автогенерации форм
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
  template?: string; // Строковый шаблон (для HTML)
  component?: string; // Имя Vue3 компонента
  componentProps?: Record<string, any>; // Пропсы для Vue3 компонента
  visible?: boolean;
  locked?: boolean;
  formConfig?: FormGenerationConfig; // Конфигурация для автогенерации форм
}

export interface BlockListDto {
  blocks: BlockDto[];
  total: number;
  page?: number;
  limit?: number;
}
