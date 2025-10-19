import { Block, BlockId, BlockSettings, BlockProps, BlockStyle } from '../domain/types';

/**
 * Валидация блоков и их свойств
 */

/**
 * Валидирует ID блока
 */
export function validateBlockId(id: BlockId): boolean {
  return id !== null && id !== undefined && id !== '';
}

/**
 * Валидирует настройки блока
 */
export function validateBlockSettings(settings: BlockSettings): boolean {
  if (typeof settings !== 'object' || settings === null) return false;
  
  // Проверяем, что все значения являются примитивами
  return Object.values(settings).every(value => 
    typeof value === 'string' || 
    typeof value === 'number' || 
    typeof value === 'boolean' ||
    value === null
  );
}

/**
 * Валидирует свойства блока
 */
export function validateBlockProps(props: BlockProps): boolean {
  if (typeof props !== 'object' || props === null) return false;
  
  // Проверяем, что все значения являются примитивами
  return Object.values(props).every(value => 
    typeof value === 'string' || 
    typeof value === 'number' || 
    typeof value === 'boolean' ||
    value === null
  );
}

/**
 * Валидирует стили блока
 */
export function validateBlockStyle(style: BlockStyle): boolean {
  if (typeof style !== 'object' || style === null) return false;
  
  // Проверяем, что все значения являются строками или числами
  return Object.values(style).every(value => 
    typeof value === 'string' || 
    typeof value === 'number'
  );
}

/**
 * Валидирует позицию блока
 */
export function validateBlockPosition(position: { x: number; y: number; z?: number }): boolean {
  return (
    typeof position.x === 'number' && 
    typeof position.y === 'number' && 
    !isNaN(position.x) && 
    !isNaN(position.y) &&
    (position.z === undefined || (typeof position.z === 'number' && !isNaN(position.z)))
  );
}

/**
 * Валидирует размер блока
 */
export function validateBlockSize(size: { width: number; height: number }): boolean {
  return (
    typeof size.width === 'number' && 
    typeof size.height === 'number' && 
    !isNaN(size.width) && 
    !isNaN(size.height) &&
    size.width > 0 &&
    size.height > 0
  );
}

/**
 * Валидирует шаблон блока
 */
export function validateBlockTemplate(template: string | HTMLElement): boolean {
  if (typeof template === 'string') {
    return template.length > 0;
  }
  
  if (template instanceof HTMLElement) {
    return true;
  }
  
  return false;
}

/**
 * Валидирует весь блок
 */
export function validateBlock(block: Block): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!validateBlockId(block.id)) {
    errors.push('Invalid block ID');
  }
  
  if (!block.type || typeof block.type !== 'string') {
    errors.push('Block type is required and must be a string');
  }
  
  if (!validateBlockSettings(block.settings)) {
    errors.push('Invalid block settings');
  }
  
  if (!validateBlockProps(block.props)) {
    errors.push('Invalid block props');
  }
  
  if (block.style && !validateBlockStyle(block.style)) {
    errors.push('Invalid block style');
  }
  
  if (block.position && !validateBlockPosition(block.position)) {
    errors.push('Invalid block position');
  }
  
  if (block.size && !validateBlockSize(block.size)) {
    errors.push('Invalid block size');
  }
  
  if (!validateBlockTemplate(block.template)) {
    errors.push('Invalid block template');
  }
  
  if (block.children && !Array.isArray(block.children)) {
    errors.push('Block children must be an array');
  }
  
  if (block.parent && !validateBlockId(block.parent)) {
    errors.push('Invalid parent block ID');
  }
  
  if (block.visible !== undefined && typeof block.visible !== 'boolean') {
    errors.push('Block visible property must be a boolean');
  }
  
  if (block.locked !== undefined && typeof block.locked !== 'boolean') {
    errors.push('Block locked property must be a boolean');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Валидирует массив блоков
 */
export function validateBlocks(blocks: Block[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(blocks)) {
    errors.push('Blocks must be an array');
    return { isValid: false, errors };
  }
  
  blocks.forEach((block, index) => {
    const validation = validateBlock(block);
    if (!validation.isValid) {
      errors.push(`Block at index ${index}: ${validation.errors.join(', ')}`);
    }
  });
  
  // Проверяем уникальность ID
  const ids = blocks.map(block => block.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push('Block IDs must be unique');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Санитизирует настройки блока
 */
export function sanitizeBlockSettings(settings: any): BlockSettings {
  if (typeof settings !== 'object' || settings === null) {
    return {};
  }
  
  const sanitized: BlockSettings = {};
  
  Object.entries(settings).forEach(([key, value]) => {
    if (typeof key === 'string' && key.length > 0) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
  });
  
  return sanitized;
}

/**
 * Санитизирует свойства блока
 */
export function sanitizeBlockProps(props: any): BlockProps {
  if (typeof props !== 'object' || props === null) {
    return {};
  }
  
  const sanitized: BlockProps = {};
  
  Object.entries(props).forEach(([key, value]) => {
    if (typeof key === 'string' && key.length > 0) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    }
  });
  
  return sanitized;
}
