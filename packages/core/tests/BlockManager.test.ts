// packages/core/tests/BlockManager.test.ts
import { BlockManager } from '../src/BlockManager';
import { describe, expect, it } from 'vitest';

describe('BlockManager', () => {
  it('adds a block', () => {
    const manager = new BlockManager();
    const block = manager.addBlock({ id: `1_test`, type: 'text', props: {} });
    expect(block.id).toBeDefined();
  });

  it('throws error on save without endpoint', async () => {
    const manager = new BlockManager();
    await expect(manager.save()).rejects.toThrow('Save endpoint is not defined');
  });
});