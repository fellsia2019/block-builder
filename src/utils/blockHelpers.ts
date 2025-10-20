import { BlockDto } from '../core/dto/BlockDto';

// Типы для утилит
export type Block = BlockDto;
// Дерево блоков для иерархического представления (дети как узлы)
export type BlockWithChildren = Omit<BlockDto, 'children'> & { children: BlockWithChildren[] };
export type BlockId = string;
export interface BlockPosition {
  x: number;
  y: number;
  z?: number;
}
export interface BlockSize {
  width: number;
  height: number;
}

/**
 * Утилиты для работы с блоками
 */

/**
 * Проверяет, находится ли точка внутри блока
 */
export function isPointInBlock(
  point: { x: number; y: number },
  block: Block
): boolean {
  if (!block.position || !block.size) return false;
  
  return (
    point.x >= block.position.x &&
    point.x <= block.position.x + block.size.width &&
    point.y >= block.position.y &&
    point.y <= block.position.y + block.size.height
  );
}

/**
 * Проверяет, пересекаются ли два блока
 */
export function doBlocksIntersect(block1: Block, block2: Block): boolean {
  if (!block1.position || !block1.size || !block2.position || !block2.size) {
    return false;
  }
  
  return !(
    block1.position.x + block1.size.width < block2.position.x ||
    block2.position.x + block2.size.width < block1.position.x ||
    block1.position.y + block1.size.height < block2.position.y ||
    block2.position.y + block2.size.height < block1.position.y
  );
}

/**
 * Находит блоки, которые пересекаются с данным блоком
 */
export function findIntersectingBlocks(
  targetBlock: Block,
  blocks: Block[]
): Block[] {
  return blocks.filter(block => 
    block.id !== targetBlock.id && 
    doBlocksIntersect(targetBlock, block)
  );
}

/**
 * Вычисляет расстояние между двумя блоками
 */
export function getDistanceBetweenBlocks(block1: Block, block2: Block): number {
  if (!block1.position || !block2.position) return Infinity;
  
  const dx = block1.position.x - block2.position.x;
  const dy = block1.position.y - block2.position.y;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Находит ближайший блок к данному
 */
export function findNearestBlock(
  targetBlock: Block,
  blocks: Block[]
): Block | null {
  const otherBlocks = blocks.filter(block => block.id !== targetBlock.id);
  if (otherBlocks.length === 0) return null;
  
  return otherBlocks.reduce((nearest, current) => {
    const nearestDistance = getDistanceBetweenBlocks(targetBlock, nearest);
    const currentDistance = getDistanceBetweenBlocks(targetBlock, current);
    
    return currentDistance < nearestDistance ? current : nearest;
  });
}

/**
 * Выравнивает блок по сетке
 */
export function snapToGrid(
  position: BlockPosition,
  gridSize: number = 20
): BlockPosition {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
    z: position.z
  };
}

/**
 * Проверяет, находится ли блок в пределах области
 */
export function isBlockInBounds(
  block: Block,
  bounds: { width: number; height: number }
): boolean {
  if (!block.position || !block.size) return false;
  
  return (
    block.position.x >= 0 &&
    block.position.y >= 0 &&
    block.position.x + block.size.width <= bounds.width &&
    block.position.y + block.size.height <= bounds.height
  );
}

/**
 * Перемещает блок в пределах области
 */
export function constrainBlockToBounds(
  block: Block,
  bounds: { width: number; height: number }
): Block {
  if (!block.position || !block.size) return block;
  
  const newPosition = { ...block.position };
  
  // Ограничиваем по X
  if (newPosition.x < 0) newPosition.x = 0;
  if (newPosition.x + block.size.width > bounds.width) {
    newPosition.x = bounds.width - block.size.width;
  }
  
  // Ограничиваем по Y
  if (newPosition.y < 0) newPosition.y = 0;
  if (newPosition.y + block.size.height > bounds.height) {
    newPosition.y = bounds.height - block.size.height;
  }
  
  return {
    ...block,
    position: newPosition
  };
}

/**
 * Создает копию блока с новым ID
 */
export function cloneBlock(block: Block, newId: BlockId): Block {
  return {
    ...block,
    id: newId,
    // В DTO дети представлены как массив id, поэтому копируем как есть
    children: Array.isArray(block.children) ? [...(block.children as any[])] : block.children,
    metadata: {
      ...block.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    }
  };
}

/**
 * Создает иерархию блоков из плоского списка
 */
export function buildBlockHierarchy(blocks: Block[]): BlockWithChildren[] {
  const blockMap = new Map<string, BlockWithChildren>(
    blocks.map(block => [block.id, { ...(block as Omit<BlockDto, 'children'>), children: [] }])
  );
  const rootBlocks: BlockWithChildren[] = [];
  
  blocks.forEach(block => {
    const blockWithChildren = blockMap.get(block.id)!;
    
    if (block.parent) {
      const parent = blockMap.get(block.parent);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(blockWithChildren);
      }
    } else {
      rootBlocks.push(blockWithChildren);
    }
  });
  
  return rootBlocks;
}

/**
 * Получает все дочерние блоки рекурсивно
 */
export function getAllChildren(block: Block, allBlocks: Block[]): Block[] {
  const children = allBlocks.filter(b => b.parent === block.id);
  let allChildren = [...children];
  
  children.forEach(child => {
    allChildren = [...allChildren, ...getAllChildren(child, allBlocks)];
  });
  
  return allChildren;
}

/**
 * Проверяет, является ли блок дочерним для другого блока
 */
export function isChildOf(childBlock: Block, parentBlock: Block, allBlocks: Block[]): boolean {
  if (childBlock.parent === parentBlock.id) return true;
  
  const parent = allBlocks.find(b => b.id === childBlock.parent);
  if (!parent) return false;
  
  return isChildOf(parent, parentBlock, allBlocks);
}
