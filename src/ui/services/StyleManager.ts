/**
 * StyleManager - отвечает только за управление стилями
 * Принцип единой ответственности (SRP)
 */

export class StyleManager {
  private stylesInjected: Set<string> = new Set();

  /**
   * Инъекция основных стилей приложения
   */
  injectMainStyles(): void {
    if (this.stylesInjected.has('main')) return;

    const style = document.createElement('style');
    style.id = 'block-builder-styles';
    style.textContent = `
      .block-builder-app {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .block-builder-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }
      .block-builder-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
        text-align: center;
      }
      .block-builder-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .block-builder-btn-primary {
        background: #007bff;
        color: white;
      }
      .block-builder-btn-primary:hover {
        background: #0056b3;
      }
      .block-builder-btn-secondary {
        background: #6c757d;
        color: white;
      }
      .block-builder-btn-secondary:hover {
        background: #5a6268;
      }
      .block-builder-btn-danger {
        background: #dc3545;
        color: white;
      }
      .block-builder-btn-danger:hover {
        background: #c82333;
      }
      .block-builder-stats {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        padding: 15px;
        background: #e9ecef;
        border-radius: 6px;
        font-size: 14px;
        color: #495057;
      }
      .block-builder-blocks {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .block-builder-block {
        border: 2px solid #007bff;
        border-radius: 8px;
        background: rgba(0, 123, 255, 0.05);
        margin-bottom: 20px;
        transition: all 0.3s ease;
        position: relative;
      }
      .block-builder-block.locked {
        border-color: #dc3545;
        background: rgba(220, 53, 69, 0.05);
      }
      .block-builder-block.hidden {
        opacity: 0.3;
      }
      .block-builder-block-header {
        background: rgba(0, 123, 255, 0.1);
        padding: 10px 15px;
        border-bottom: 1px solid #007bff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #2c3e50;
      }
      .block-builder-block-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .block-builder-block-controls {
        display: flex;
        gap: 5px;
      }
      .block-builder-control-btn {
        background: none;
        border: none;
        padding: 5px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      }
      .block-builder-control-btn:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      .block-builder-block-content {
        padding: 20px;
        min-height: 50px;
      }
      .locked-indicator, .hidden-indicator {
        font-size: 12px;
        margin-left: 5px;
      }
      .vue-component-container {
        min-height: 50px;
        padding: 10px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        background: #f8f9fa;
      }
      .vue-error {
        color: #dc3545;
        font-size: 12px;
        padding: 10px;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
      }
      .block-content-fallback {
        padding: 20px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
      }
      .block-content-fallback pre {
        margin: 10px 0 0 0;
        white-space: pre-wrap;
        word-break: break-all;
      }
    `;
    document.head.appendChild(style);
    this.stylesInjected.add('main');
  }

  /**
   * Инъекция стилей для модальных окон
   */
  injectModalStyles(): void {
    if (this.stylesInjected.has('modal')) return;

    const style = document.createElement('style');
    style.id = 'block-builder-modal-styles';
    style.textContent = `
      .block-builder-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .block-builder-modal-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .block-builder-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .block-builder-modal-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.25rem;
      }

      .block-builder-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }

      .block-builder-modal-close:hover {
        background: #f8f9fa;
        color: #333;
      }

      .block-builder-modal-body {
        padding: 20px;
      }

      .block-builder-modal-footer {
        padding: 20px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .block-builder-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .block-builder-form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .block-builder-form-label {
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      .block-builder-form-label .required {
        color: #dc3545;
        margin-left: 4px;
      }

      .block-builder-form-control {
        padding: 12px;
        border: 2px solid #e9ecef;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.2s ease;
        font-family: inherit;
      }

      .block-builder-form-control:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .block-builder-form-control:invalid {
        border-color: #dc3545;
      }

      .block-builder-form-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .block-builder-form-checkbox-input {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .block-builder-form-checkbox-label {
        font-size: 14px;
        color: #333;
        cursor: pointer;
      }

      textarea.block-builder-form-control {
        resize: vertical;
        min-height: 80px;
      }

      select.block-builder-form-control {
        cursor: pointer;
      }

      input[type="color"].block-builder-form-control {
        width: 60px;
        height: 40px;
        padding: 4px;
        cursor: pointer;
      }

      input[type="number"].block-builder-form-control {
        width: 120px;
      }

      input[type="url"].block-builder-form-control {
        font-family: monospace;
      }
    `;
    document.head.appendChild(style);
    this.stylesInjected.add('modal');
  }

  /**
   * Удаление всех инъектированных стилей
   */
  removeAllStyles(): void {
    document.getElementById('block-builder-styles')?.remove();
    document.getElementById('block-builder-modal-styles')?.remove();
    this.stylesInjected.clear();
  }
}

