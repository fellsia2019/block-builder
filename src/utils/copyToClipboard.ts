/**
 * Универсальная утилита для копирования текста в буфер обмена
 * Работает в различных окружениях (secure context и legacy browsers)
 * Следуем принципу Pure Function
 */

/**
 * Fallback метод для копирования в буфер обмена (для non-secure контекста)
 */
const unsecuredCopyToClipboard = (text: string): void => {
  const element = document.createElement('div');
  element.textContent = text;
  element.style.cssText =
    'position: fixed; opacity: 0; left: 50%; top: 50%; height: 1px; width: 1px; pointer-events: none; touch-action: none;';
  document.body.append(element);

  const range = document.createRange();
  range.selectNode(element);

  const selection = window.getSelection();
  if (!selection) {
    element.remove();
    return;
  }

  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand('copy');
  } catch (error) {
    console.warn('unsecuredCopyToClipboard: Unable to copy to clipboard', error);
  } finally {
    selection.removeAllRanges();
    element.remove();
  }
};

/**
 * Копирует текст в буфер обмена
 * @param content - текст для копирования
 * @returns true если успешно, false если произошла ошибка
 */
export const copyToClipboard = (content: string): boolean => {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    } else {
      unsecuredCopyToClipboard(content);
    }
    return true;
  } catch (error) {
    console.warn('copyToClipboard: Unable to copy to clipboard', error);
    return false;
  }
};

