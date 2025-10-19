import { BlockEntity } from '../domain/entities/Block';
import { Block } from '../domain/types';

describe('BlockEntity', () => {
  let blockEntity: BlockEntity;
  let blockData: Block;

  beforeEach(() => {
    blockData = {
      id: 'test-block-1',
      type: 'text',
      settings: { fontSize: 16, color: '#333' },
      props: { content: 'Hello World' },
      template: '<div>{{ props.content }}</div>',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      visible: true,
      locked: false,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1
      }
    };

    blockEntity = new BlockEntity(blockData);
  });

  describe('constructor', () => {
    it('should create block entity with provided data', () => {
      expect(blockEntity.id).toBe('test-block-1');
      expect(blockEntity.type).toBe('text');
      expect(blockEntity.settings.fontSize).toBe(16);
      expect(blockEntity.props.content).toBe('Hello World');
    });
  });

  describe('updateSettings', () => {
    it('should update block settings', () => {
      blockEntity.updateSettings({ fontSize: 20, color: '#ff0000' });

      expect(blockEntity.settings.fontSize).toBe(20);
      expect(blockEntity.settings.color).toBe('#ff0000');
    });

    it('should preserve existing settings', () => {
      blockEntity.updateSettings({ fontSize: 20 });

      expect(blockEntity.settings.fontSize).toBe(20);
      expect(blockEntity.settings.color).toBe('#333');
    });
  });

  describe('updateProps', () => {
    it('should update block props', () => {
      blockEntity.updateProps({ content: 'Updated content' });

      expect(blockEntity.props.content).toBe('Updated content');
    });
  });

  describe('moveTo', () => {
    it('should move block to new position', () => {
      const newPosition = { x: 200, y: 300 };
      blockEntity.moveTo(newPosition);

      expect(blockEntity.position).toEqual(newPosition);
    });
  });

  describe('resize', () => {
    it('should resize block', () => {
      const newSize = { width: 300, height: 100 };
      blockEntity.resize(newSize);

      expect(blockEntity.size).toEqual(newSize);
    });
  });

  describe('setLocked', () => {
    it('should lock block', () => {
      blockEntity.setLocked(true);
      expect(blockEntity.locked).toBe(true);
    });

    it('should unlock block', () => {
      blockEntity.setLocked(false);
      expect(blockEntity.locked).toBe(false);
    });
  });

  describe('setVisible', () => {
    it('should show block', () => {
      blockEntity.setVisible(true);
      expect(blockEntity.visible).toBe(true);
    });

    it('should hide block', () => {
      blockEntity.setVisible(false);
      expect(blockEntity.visible).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('should return true for unlocked and visible block', () => {
      expect(blockEntity.canEdit()).toBe(true);
    });

    it('should return false for locked block', () => {
      blockEntity.setLocked(true);
      expect(blockEntity.canEdit()).toBe(false);
    });

    it('should return false for hidden block', () => {
      blockEntity.setVisible(false);
      expect(blockEntity.canEdit()).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should return true for unlocked block', () => {
      expect(blockEntity.canDelete()).toBe(true);
    });

    it('should return false for locked block', () => {
      blockEntity.setLocked(true);
      expect(blockEntity.canDelete()).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create clone with new ID', () => {
      const newId = 'cloned-block-1';
      const clonedEntity = blockEntity.clone(newId);

      expect(clonedEntity.id).toBe(newId);
      expect(clonedEntity.type).toBe(blockEntity.type);
      expect(clonedEntity.settings).toEqual(blockEntity.settings);
      expect(clonedEntity.props).toEqual(blockEntity.props);
    });

    it('should not affect original block', () => {
      const newId = 'cloned-block-1';
      const clonedEntity = blockEntity.clone(newId);

      expect(blockEntity.id).toBe('test-block-1');
      expect(clonedEntity.id).toBe(newId);
    });
  });

  describe('toJSON', () => {
    it('should return serialized block', () => {
      const json = blockEntity.toJSON();

      expect(json.id).toBe(blockData.id);
      expect(json.type).toBe(blockData.type);
      expect(json.settings).toEqual(blockData.settings);
      expect(json.props).toEqual(blockData.props);
    });
  });
});
