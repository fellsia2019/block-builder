import { BlockDto } from '../core/dto/BlockDto';

// Типы для утилит
export type Block = BlockDto;
// Дерево блоков для иерархического представления (дети как узлы)
export type BlockWithChildren = Omit<BlockDto, 'children'> & { children: BlockWithChildren[] };
export type BlockId = string;

/**
 * Утилиты для работы с блоками
 */





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
