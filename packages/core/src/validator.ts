import type { BaseBlockModel } from './types';

/**
 * Валидирует блок по минимальной схеме.
 * @throws {Error} – Если блок невалиден.
 */
export function validateBlock(block: BaseBlockModel): void {
  if (!block.type) {
    throw new Error('Block type is required');
  }
  if (typeof block.props !== 'object') {
    throw new Error('Block props must be an object');
  }
}