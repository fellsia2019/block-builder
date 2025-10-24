/**
 * Утилиты для автоматического добавления spacing полей в формы блоков
 */

import { IFormFieldConfig, IBlockSpacingOptions, TSpacingType } from '../core/types/form';

/**
 * Генерирует spacing поле на основе опций блока
 */
export function generateSpacingField(
  options?: IBlockSpacingOptions
): IFormFieldConfig | null {
  // Если spacing явно выключен
  if (options?.enabled === false) {
    return null;
  }

  // Определяем типы отступов
  const spacingTypes: TSpacingType[] = options?.spacingTypes || [
    'padding-top',
    'padding-bottom',
    'margin-top',
    'margin-bottom'
  ];

  // Базовая конфигурация
  const spacingConfig = {
    spacingTypes,
    min: options?.config?.min ?? 0,
    max: options?.config?.max ?? 200,
    step: options?.config?.step ?? 4,
    breakpoints: options?.config?.breakpoints,
    defaultBreakpoints: options?.config?.defaultBreakpoints ?? true
  };

  // Генерируем defaultValue динамически на основе брекпоинтов
  const defaultValue: Record<string, Record<TSpacingType, number>> = {};
  
  // Определяем какие брекпоинты использовать
  const useDefaultBreakpoints = spacingConfig.defaultBreakpoints !== false;
  const hasCustomBreakpoints = spacingConfig.breakpoints && spacingConfig.breakpoints.length > 0;
  
  // Дефолтные брекпоинты
  const defaultBreakpoints = ['desktop', 'tablet', 'mobile'];
  
  if (useDefaultBreakpoints && !hasCustomBreakpoints) {
    // Только дефолтные
    defaultBreakpoints.forEach(bpName => {
      defaultValue[bpName] = {
        'padding-top': 0,
        'padding-bottom': 0,
        'margin-top': 0,
        'margin-bottom': 0
      };
    });
  } else if (hasCustomBreakpoints && !useDefaultBreakpoints) {
    // Только кастомные
    spacingConfig.breakpoints!.forEach(bp => {
      defaultValue[bp.name] = {
        'padding-top': 0,
        'padding-bottom': 0,
        'margin-top': 0,
        'margin-bottom': 0
      };
    });
  } else if (hasCustomBreakpoints && useDefaultBreakpoints) {
    // Дефолтные + кастомные
    defaultBreakpoints.forEach(bpName => {
      defaultValue[bpName] = {
        'padding-top': 0,
        'padding-bottom': 0,
        'margin-top': 0,
        'margin-bottom': 0
      };
    });
    spacingConfig.breakpoints!.forEach(bp => {
      defaultValue[bp.name] = {
        'padding-top': 0,
        'padding-bottom': 0,
        'margin-top': 0,
        'margin-bottom': 0
      };
    });
  }

  return {
    field: 'spacing',
    label: 'Отступы блока',
    type: 'spacing',
    spacingConfig,
    defaultValue
  };
}

/**
 * Добавляет spacing поле в массив полей, если его там нет
 */
export function addSpacingFieldToFields(
  fields: IFormFieldConfig[],
  spacingOptions?: IBlockSpacingOptions
): IFormFieldConfig[] {
  // Проверяем, есть ли уже spacing поле
  const hasSpacingField = fields.some(field => field.type === 'spacing');

  if (hasSpacingField) {
    // Spacing уже есть, не добавляем
    return fields;
  }

  // Генерируем spacing поле
  const spacingField = generateSpacingField(spacingOptions);

  if (!spacingField) {
    // Spacing выключен
    return fields;
  }

  // Добавляем в конец массива полей
  return [...fields, spacingField];
}

/**
 * Обработка конфигурации блока с автоматическим добавлением spacing
 */
export function processBlockConfigWithSpacing(
  blockConfig: {
    fields?: IFormFieldConfig[];
    spacingOptions?: IBlockSpacingOptions;
    [key: string]: any;
  }
): typeof blockConfig {
  if (!blockConfig.fields) {
    return blockConfig;
  }

  return {
    ...blockConfig,
    fields: addSpacingFieldToFields(blockConfig.fields, blockConfig.spacingOptions)
  };
}

/**
 * Применяет spacing к конфигурациям всех блоков
 */
export function applySpacingToAllBlockConfigs(
  blockConfigs: Record<string, any>,
  globalSpacingOptions?: IBlockSpacingOptions
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, config] of Object.entries(blockConfigs)) {
    // Используем локальные опции блока или глобальные
    const spacingOptions = config.spacingOptions ?? globalSpacingOptions;

    result[key] = processBlockConfigWithSpacing({
      ...config,
      spacingOptions
    });
  }

  return result;
}

