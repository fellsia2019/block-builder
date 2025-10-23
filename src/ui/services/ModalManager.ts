/**
 * ModalManager - отвечает только за управление модальными окнами
 * Принцип единой ответственности (SRP)
 */

export interface IModalOptions {
  title: string;
  bodyHTML: string;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
}

export class ModalManager {
  private static readonly MODAL_ID = 'block-builder-modal';

  /**
   * Показать модальное окно
   */
  showModal(options: IModalOptions): void {
    // Удаляем существующее модальное окно
    this.closeModal();

    const modalHTML = `
      <div id="${ModalManager.MODAL_ID}" class="block-builder-modal">
        <div class="block-builder-modal-content">
          <div class="block-builder-modal-header">
            <h3>${options.title}</h3>
            <button onclick="blockBuilder.closeModal()" class="block-builder-modal-close">&times;</button>
          </div>
          <div class="block-builder-modal-body">
            ${options.bodyHTML}
          </div>
          <div class="block-builder-modal-footer">
            <button onclick="blockBuilder.closeModal()" class="block-builder-btn block-builder-btn--secondary">
              ${options.cancelButtonText || 'Отмена'}
            </button>
            <button onclick="blockBuilder.submitModal()" class="block-builder-btn block-builder-btn--primary">
              ${options.submitButtonText || 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Сохраняем обработчики
    (window as any).__modalHandlers = {
      onSubmit: options.onSubmit,
      onCancel: options.onCancel
    };
  }

  /**
   * Закрыть модальное окно
   */
  closeModal(): void {
    const modal = document.getElementById(ModalManager.MODAL_ID);
    if (modal) {
      modal.remove();
    }

    // Очищаем обработчики
    delete (window as any).__modalHandlers;
  }

  /**
   * Обработка submit модального окна
   */
  submitModal(): void {
    const handlers = (window as any).__modalHandlers;
    if (handlers?.onSubmit) {
      handlers.onSubmit();
    }
  }

  /**
   * Получение данных формы из модального окна
   */
  getFormData(formId: string): Record<string, any> {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return {};

    const formData = new FormData(form);
    const props: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      props[key] = value;
    }

    return props;
  }

  /**
   * Проверка существования модального окна
   */
  isModalOpen(): boolean {
    return document.getElementById(ModalManager.MODAL_ID) !== null;
  }
}

