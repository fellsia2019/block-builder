/**
 * Утилиты для работы с ошибками валидации форм
 * Обработка скролла к первой ошибке и открытие аккордеонов
 */

export interface IFirstErrorInfo {
  fieldKey: string;
  isRepeaterField: boolean;
  repeaterFieldName?: string;
  repeaterIndex?: number;
  nestedFieldName?: string;
}

/**
 * Парсинг ключа ошибки
 * Примеры:
 * - "title" -> { fieldKey: "title", isRepeaterField: false }
 * - "cards[0].title" -> { fieldKey: "cards[0].title", isRepeaterField: true, repeaterFieldName: "cards", repeaterIndex: 0, nestedFieldName: "title" }
 */
export function parseErrorKey(errorKey: string): IFirstErrorInfo {
  const repeaterMatch = errorKey.match(/^([a-zA-Z_]+)\[(\d+)\]\.(.+)$/);
  
  if (repeaterMatch) {
    return {
      fieldKey: errorKey,
      isRepeaterField: true,
      repeaterFieldName: repeaterMatch[1],
      repeaterIndex: parseInt(repeaterMatch[2], 10),
      nestedFieldName: repeaterMatch[3]
    };
  }
  
  return {
    fieldKey: errorKey,
    isRepeaterField: false
  };
}

/**
 * Получение первого ключа с ошибкой из объекта ошибок
 */
export function getFirstErrorKey(errors: Record<string, string[]>): string | null {
  const errorKeys = Object.keys(errors);
  
  if (errorKeys.length === 0) {
    return null;
  }
  
  // Сортируем ключи, чтобы сначала шли обычные поля, потом repeater поля
  // Это гарантирует правильный порядок обработки
  const sortedKeys = errorKeys.sort((a, b) => {
    const aInfo = parseErrorKey(a);
    const bInfo = parseErrorKey(b);
    
    // Обычные поля всегда первые
    if (!aInfo.isRepeaterField && bInfo.isRepeaterField) return -1;
    if (aInfo.isRepeaterField && !bInfo.isRepeaterField) return 1;
    
    // Если оба repeater - сравниваем по индексу
    if (aInfo.isRepeaterField && bInfo.isRepeaterField) {
      if (aInfo.repeaterFieldName !== bInfo.repeaterFieldName) {
        return aInfo.repeaterFieldName!.localeCompare(bInfo.repeaterFieldName!);
      }
      return (aInfo.repeaterIndex || 0) - (bInfo.repeaterIndex || 0);
    }
    
    // Если оба обычные - сравниваем по имени
    return a.localeCompare(b);
  });
  
  return sortedKeys[0];
}

/**
 * Поиск DOM элемента поля по его имени
 * Поддерживает обычные поля и поля внутри repeater
 */
export function findFieldElement(
  containerElement: HTMLElement,
  errorInfo: IFirstErrorInfo
): HTMLElement | null {
  if (!errorInfo.isRepeaterField) {
    // Обычное поле - ищем родительский контейнер .block-builder-form-group
    // Это нужно, чтобы скроллить к группе вместе с лейблом, а не только к полю
    
    // Сначала пробуем по data-field-name (самый надежный способ)
    let formGroup = containerElement.querySelector(
      `.block-builder-form-group[data-field-name="${errorInfo.fieldKey}"]`
    ) as HTMLElement;
    
    if (formGroup) {
      return formGroup;
    }
    
    // Если не нашли - ищем по классу error на form-group
    formGroup = containerElement.querySelector(
      `.block-builder-form-group.error`
    ) as HTMLElement;
    
    if (formGroup) {
      return formGroup;
    }
    
    // Fallback - ищем поле и получаем его родителя
    const fieldId = `field-${errorInfo.fieldKey}`;
    const element = containerElement.querySelector(`#${fieldId}`) as HTMLElement;
    
    if (element) {
      const parentGroup = element.closest('.block-builder-form-group') as HTMLElement;
      return parentGroup || element;
    }
    
    return null;
  }
  
  // Repeater поле - ищем поле внутри конкретного элемента repeater
  // Формат ID: repeater-{itemId}-{fieldName} или repeater-{fieldName}-{index}-{nestedFieldName}
  const repeaterSelector = `[data-field-name="${errorInfo.repeaterFieldName}"]`;
  const repeaterContainer = containerElement.querySelector(repeaterSelector);
  
  if (!repeaterContainer) {
    return null;
  }
  
  // Ищем конкретный элемент repeater по индексу
  const repeaterItems = repeaterContainer.querySelectorAll('.repeater-control__item');
  const targetItem = repeaterItems[errorInfo.repeaterIndex || 0] as HTMLElement;
  
  if (!targetItem) {
    return null;
  }
  
  // Проверяем, свернут ли элемент (есть класс collapsed)
  const isCollapsed = targetItem.classList.contains('repeater-control__item--collapsed');
  
  // Если элемент свернут, возвращаем заголовок
  // (аккордеон будет раскрыт позже, и произойдет повторный скролл к полю)
  if (isCollapsed) {
    const itemHeader = targetItem.querySelector('.repeater-control__item-header') as HTMLElement;
    return itemHeader || targetItem;
  }
  
  // Если элемент развернут, ищем конкретное поле с ошибкой
  // Сначала пытаемся найти .repeater-control__field с полем
  const fieldContainer = Array.from(targetItem.querySelectorAll('.repeater-control__field')).find(field => {
    const input = field.querySelector(`[data-field-name="${errorInfo.nestedFieldName}"]`);
    return input !== null;
  }) as HTMLElement;
  
  if (fieldContainer) {
    return fieldContainer;
  }
  
  // Fallback - ищем поле напрямую
  const fieldSelector = `[data-field-name="${errorInfo.nestedFieldName}"], [id*="${errorInfo.nestedFieldName}"]`;
  const field = targetItem.querySelector(fieldSelector) as HTMLElement;
  
  if (field) {
    // Пытаемся найти родительский .repeater-control__field
    const parentField = field.closest('.repeater-control__field') as HTMLElement;
    return parentField || field;
  }
  
  // Если ничего не нашли - возвращаем заголовок элемента
  const itemHeader = targetItem.querySelector('.repeater-control__item-header') as HTMLElement;
  return itemHeader || targetItem;
}

/**
 * Скролл к элементу с анимацией
 */
export function scrollToElement(
  element: HTMLElement,
  options: {
    offset?: number;
    behavior?: ScrollBehavior;
    container?: HTMLElement;
  } = {}
): void {
  const {
    offset = 20,
    behavior = 'smooth',
    container
  } = options;
  
  // Определяем контейнер для скролла
  const scrollContainer = container || getScrollContainer(element);
  
  if (!scrollContainer) {
    // Fallback на window.scroll
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const targetPosition = absoluteElementTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior
    });
    return;
  }
  
  // Скролл внутри контейнера
  const elementRect = element.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  const relativeTop = elementRect.top - containerRect.top;
  const targetScrollTop = scrollContainer.scrollTop + relativeTop - offset;
  
  scrollContainer.scrollTo({
    top: targetScrollTop,
    behavior
  });
}

/**
 * Поиск ближайшего скроллируемого контейнера
 */
function getScrollContainer(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;
  
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    
    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent;
    }
    
    parent = parent.parentElement;
  }
  
  return null;
}

/**
 * Фокус на элементе (если это input/textarea/select)
 */
export function focusElement(element: HTMLElement): void {
  // Если передана группа полей - ищем внутри неё input/textarea/select
  let targetElement = element;
  
  if (!isFormField(element)) {
    // Ищем первое поле ввода внутри элемента
    const field = element.querySelector('input, textarea, select') as HTMLElement;
    if (field && isFormField(field)) {
      targetElement = field;
    }
  }
  
  if (isFormField(targetElement)) {
    // Добавляем небольшую задержку, чтобы скролл успел завершиться
    setTimeout(() => {
      (targetElement as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).focus();
      
      // Подсвечиваем поле с ошибкой
      targetElement.classList.add('field-error-highlight');
      setTimeout(() => {
        targetElement.classList.remove('field-error-highlight');
      }, 2000);
    }, 300);
  }
}

/**
 * Проверка, является ли элемент полем формы
 */
function isFormField(element: HTMLElement): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

/**
 * Обработка скролла к первой ошибке
 * Возвращает информацию о первой ошибке для дальнейшей обработки
 */
export function scrollToFirstError(
  containerElement: HTMLElement,
  errors: Record<string, string[]>,
  options: {
    offset?: number;
    behavior?: ScrollBehavior;
    autoFocus?: boolean;
  } = {}
): IFirstErrorInfo | null {
  const firstErrorKey = getFirstErrorKey(errors);
  
  if (!firstErrorKey) {
    return null;
  }
  
  const errorInfo = parseErrorKey(firstErrorKey);
  const fieldElement = findFieldElement(containerElement, errorInfo);
  
  if (!fieldElement) {
    console.warn(`[scrollToFirstError] Не удалось найти элемент для ошибки: ${firstErrorKey}`);
    return errorInfo;
  }
  
  // Скроллим к элементу
  scrollToElement(fieldElement, {
    offset: options.offset,
    behavior: options.behavior
  });
  
  // Фокусируемся на элементе, если нужно
  if (options.autoFocus !== false) {
    focusElement(fieldElement);
  }
  
  return errorInfo;
}

