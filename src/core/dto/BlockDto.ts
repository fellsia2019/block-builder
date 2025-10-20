/**
 * DTO для передачи данных блока
 * Содержит только данные, без бизнес-логики
 */

import { IFormGenerationConfig } from '../entities/ValidationRule';

// Рендер-описание (универсальное, независимое от фреймворка)
export type TRenderRef =
  | {
      kind: 'html';
      template: string;
    }
  | {
      kind: 'component';
      framework: 'vue' | 'react' | string; // Позволяет добавлять новые движки без изменения DTO
      name?: string; // Имя компонента в реестре/адаптере
      component?: any; // Прямая ссылка на компонент
      props?: Record<string, any>;
    }
  | {
      kind: 'external';
      adapter: string; // Имя адаптера/рендерера, реализуемого в UI слое
      payload: Record<string, any>; // Произвольные данные для адаптера
    };

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

export interface IBlockListDto {
  blocks: IBlockDto[];
  total: number;
  page?: number;
  limit?: number;
}
