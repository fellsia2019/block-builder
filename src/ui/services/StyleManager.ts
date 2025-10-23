/**
 * StyleManager - отвечает только за управление стилями
 * Принцип единой ответственности (SRP)
 * 
 * Теперь использует единый CSS файл для всех стилей
 */

import styles from '../styles/styles';

export class StyleManager {
  private stylesInjected: boolean = false;

  /**
   * Инъекция всех стилей приложения
   */
  injectStyles(): void {
    if (this.stylesInjected) return;

    const style = document.createElement('style');
    style.id = 'block-builder-styles';
    style.textContent = styles;
    document.head.appendChild(style);
    this.stylesInjected = true;
  }

  /**
   * Инъекция основных стилей приложения
   * @deprecated Используйте injectStyles() вместо этого
   */
  injectMainStyles(): void {
    this.injectStyles();
  }

  /**
   * Инъекция стилей для модальных окон
   * @deprecated Используйте injectStyles() вместо этого
   */
  injectModalStyles(): void {
    this.injectStyles();
  }

  /**
   * Удаление всех инъектированных стилей
   */
  removeAllStyles(): void {
    document.getElementById('block-builder-styles')?.remove();
    this.stylesInjected = false;
  }

  /**
   * Проверка инъекции стилей
   */
  areStylesInjected(): boolean {
    return this.stylesInjected;
  }
}
