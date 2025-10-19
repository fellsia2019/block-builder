import { BlockService } from '../application/services/BlockService';
import { MemoryBlockRepository } from '../infrastructure/repositories/MemoryBlockRepository';
import { Block } from '../domain/types';

describe('BlockService', () => {
  let blockService: BlockService;
  let blockRepository: MemoryBlockRepository;

  beforeEach(() => {
    blockRepository = new MemoryBlockRepository();
    blockService = new BlockService(blockRepository);
  });

  describe('createBlock', () => {
    it('should create a new block', async () => {
      const blockData = {
        type: 'text',
        settings: { fontSize: 16 },
        props: { content: 'Hello World' },
        template: '<div>{{ props.content }}</div>',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 50 }
      };

      const block = await blockService.createBlock(blockData);

      expect(block).toBeDefined();
      expect(block.id).toBeDefined();
      expect(block.type).toBe('text');
      expect(block.settings.fontSize).toBe(16);
      expect(block.props.content).toBe('Hello World');
    });

    it('should generate unique IDs', async () => {
      const blockData = {
        type: 'text',
        settings: {},
        props: {},
        template: '<div>Test</div>'
      };

      const block1 = await blockService.createBlock(blockData);
      const block2 = await blockService.createBlock(blockData);

      expect(block1.id).not.toBe(block2.id);
    });
  });

  describe('getBlock', () => {
    it('should return block by ID', async () => {
      const blockData = {
        type: 'text',
        settings: {},
        props: {},
        template: '<div>Test</div>'
      };

      const createdBlock = await blockService.createBlock(blockData);
      const retrievedBlock = await blockService.getBlock(createdBlock.id);

      expect(retrievedBlock).toBeDefined();
      expect(retrievedBlock?.id).toBe(createdBlock.id);
    });

    it('should return null for non-existent block', async () => {
      const block = await blockService.getBlock('non-existent-id');
      expect(block).toBeNull();
    });
  });

  describe('updateBlockSettings', () => {
    it('should update block settings', async () => {
      const blockData = {
        type: 'text',
        settings: { fontSize: 16 },
        props: {},
        template: '<div>Test</div>'
      };

      const block = await blockService.createBlock(blockData);
      const success = await blockService.updateBlockSettings(block.id, { fontSize: 20 });

      expect(success).toBe(true);

      const updatedBlock = await blockService.getBlock(block.id);
      expect(updatedBlock?.settings.fontSize).toBe(20);
    });

    it('should return false for non-existent block', async () => {
      const success = await blockService.updateBlockSettings('non-existent-id', { fontSize: 20 });
      expect(success).toBe(false);
    });
  });

  describe('deleteBlock', () => {
    it('should delete block', async () => {
      const blockData = {
        type: 'text',
        settings: {},
        props: {},
        template: '<div>Test</div>'
      };

      const block = await blockService.createBlock(blockData);
      const success = await blockService.deleteBlock(block.id);

      expect(success).toBe(true);

      const deletedBlock = await blockService.getBlock(block.id);
      expect(deletedBlock).toBeNull();
    });

    it('should return false for non-existent block', async () => {
      const success = await blockService.deleteBlock('non-existent-id');
      expect(success).toBe(false);
    });
  });

  describe('getAllBlocks', () => {
    it('should return all blocks', async () => {
      const blockData1 = {
        type: 'text',
        settings: {},
        props: {},
        template: '<div>Test 1</div>'
      };

      const blockData2 = {
        type: 'image',
        settings: {},
        props: {},
        template: '<img src="test.jpg" />'
      };

      await blockService.createBlock(blockData1);
      await blockService.createBlock(blockData2);

      const allBlocks = await blockService.getAllBlocks();
      expect(allBlocks).toHaveLength(2);
    });
  });

  describe('moveBlock', () => {
    it('should move block to new position', async () => {
      const blockData = {
        type: 'text',
        settings: {},
        props: {},
        template: '<div>Test</div>',
        position: { x: 100, y: 100 }
      };

      const block = await blockService.createBlock(blockData);
      const newPosition = { x: 200, y: 300 };
      
      const success = await blockService.moveBlock(block.id, newPosition);
      expect(success).toBe(true);

      const movedBlock = await blockService.getBlock(block.id);
      expect(movedBlock?.position).toEqual(newPosition);
    });
  });

  describe('setBlockLocked', () => {
    it('should lock/unlock block', async () => {
      const blockData = {
        type: 'text',
        settings: {},
        props: {},
        template: '<div>Test</div>'
      };

      const block = await blockService.createBlock(blockData);
      
      // Lock block
      const lockSuccess = await blockService.setBlockLocked(block.id, true);
      expect(lockSuccess).toBe(true);

      const lockedBlock = await blockService.getBlock(block.id);
      expect(lockedBlock?.locked).toBe(true);

      // Unlock block
      const unlockSuccess = await blockService.setBlockLocked(block.id, false);
      expect(unlockSuccess).toBe(true);

      const unlockedBlock = await blockService.getBlock(block.id);
      expect(unlockedBlock?.locked).toBe(false);
    });
  });
});
