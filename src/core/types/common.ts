/**
 * Общие типы для всего приложения
 */

// Базовые типы
export type TBlockId = string;

// Vue3 Component type (без импорта Vue для совместимости)
export type TComponent = any;

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

// Общие интерфейсы для данных
export interface IFormData {
  [key: string]: any;
}
