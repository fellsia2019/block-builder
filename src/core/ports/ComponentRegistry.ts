// Vue3 Component type (без импорта Vue для совместимости)
export type Component = any;

/**
 * Port для регистрации Vue3 компонентов
 * Позволяет регистрировать пользовательские компоненты для блоков
 */
export interface ComponentRegistry {
  /**
   * Регистрация компонента
   */
  register(name: string, component: Component): void;

  /**
   * Получение компонента по имени
   */
  get(name: string): Component | null;

  /**
   * Проверка существования компонента
   */
  has(name: string): boolean;

  /**
   * Получение всех зарегистрированных компонентов
   */
  getAll(): Record<string, Component>;

  /**
   * Удаление компонента
   */
  unregister(name: string): boolean;

  /**
   * Очистка всех компонентов
   */
  clear(): void;
}
