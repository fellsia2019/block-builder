<template>
  <div class="block-builder" :class="{ 'is-dragging': isDragging }">
    <div class="block-builder__toolbar">
      <button 
        v-for="blockType in availableBlockTypes" 
        :key="blockType.type"
        @click="addBlock(blockType.type)"
        class="toolbar-button"
      >
        {{ blockType.label }}
      </button>
    </div>
    
    <div 
      class="block-builder__canvas"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @click="handleCanvasClick"
    >
      <BlockComponent
        v-for="block in blocks"
        :key="block.id"
        :block="block"
        :selected="selectedBlocks.includes(block.id)"
        @select="selectBlock"
        @update="updateBlock"
        @delete="deleteBlock"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
      />
    </div>
    
    <div v-if="selectedBlocks.length > 0" class="block-builder__properties">
      <h3>Properties</h3>
      <BlockProperties
        :block="selectedBlock"
        @update="updateBlockProperties"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Block, BlockId, BlockSettings, BlockProps, BlockStyle, BlockPosition } from '../../domain/types';
import { BlockService } from '../../application/services/BlockService';
import { MemoryBlockRepository } from '../../infrastructure/repositories/MemoryBlockRepository';
import BlockComponent from './BlockComponent.vue';
import BlockProperties from './BlockProperties.vue';

interface BlockType {
  type: string;
  label: string;
  template: string;
  defaultSettings: BlockSettings;
  defaultProps: BlockProps;
}

interface Props {
  config?: {
    availableBlockTypes?: BlockType[];
    allowNesting?: boolean;
    maxDepth?: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    allowNesting: true,
    maxDepth: 5
  })
});

const emit = defineEmits<{
  'block-added': [block: Block];
  'block-updated': [block: Block];
  'block-deleted': [blockId: BlockId];
  'blocks-reordered': [blocks: Block[]];
}>();

// Инициализация сервисов
const blockRepository = new MemoryBlockRepository();
const blockService = new BlockService(blockRepository);

// Состояние
const blocks = ref<Block[]>([]);
const selectedBlocks = ref<BlockId[]>([]);
const isDragging = ref(false);
const dragStartPosition = ref<{ x: number; y: number } | null>(null);

// Доступные типы блоков
const availableBlockTypes = ref<BlockType[]>([
  {
    type: 'text',
    label: 'Text',
    template: '<div class="text-block">{{ props.content }}</div>',
    defaultSettings: { fontSize: 16, color: '#000000' },
    defaultProps: { content: 'New text block' }
  },
  {
    type: 'image',
    label: 'Image',
    template: '<img :src="props.src" :alt="props.alt" class="image-block" />',
    defaultSettings: { width: 300, height: 200 },
    defaultProps: { src: '', alt: 'Image' }
  },
  {
    type: 'button',
    label: 'Button',
    template: '<button class="button-block">{{ props.text }}</button>',
    defaultSettings: { backgroundColor: '#007bff', color: '#ffffff' },
    defaultProps: { text: 'Click me' }
  }
]);

// Вычисляемые свойства
const selectedBlock = computed(() => {
  if (selectedBlocks.value.length === 1) {
    return blocks.value.find(block => block.id === selectedBlocks.value[0]);
  }
  return null;
});

// Методы
const loadBlocks = async () => {
  const blockEntities = await blockService.getAllBlocks();
  blocks.value = blockEntities.map(entity => entity.toJSON());
};

const addBlock = async (type: string) => {
  const blockType = availableBlockTypes.value.find(bt => bt.type === type);
  if (!blockType) return;

  const blockEntity = await blockService.createBlock({
    type: blockType.type,
    settings: { ...blockType.defaultSettings },
    props: { ...blockType.defaultProps },
    template: blockType.template,
    position: { x: 100, y: 100 },
    size: { width: 200, height: 100 }
  });

  blocks.value.push(blockEntity.toJSON());
  selectBlock(blockEntity.id);
  emit('block-added', blockEntity.toJSON());
};

const selectBlock = (blockId: BlockId) => {
  if (selectedBlocks.value.includes(blockId)) {
    selectedBlocks.value = selectedBlocks.value.filter(id => id !== blockId);
  } else {
    selectedBlocks.value.push(blockId);
  }
};

const updateBlock = async (blockId: BlockId, updates: Partial<Block>) => {
  const blockEntity = await blockService.getBlock(blockId);
  if (!blockEntity) return;

  // Обновляем блок через сервис
  if (updates.settings) {
    await blockService.updateBlockSettings(blockId, updates.settings);
  }
  if (updates.props) {
    await blockService.updateBlockProps(blockId, updates.props);
  }
  if (updates.style) {
    await blockService.updateBlockStyle(blockId, updates.style);
  }
  if (updates.position) {
    await blockService.moveBlock(blockId, updates.position);
  }
  if (updates.size) {
    await blockService.resizeBlock(blockId, updates.size);
  }

  // Обновляем локальное состояние
  const index = blocks.value.findIndex(block => block.id === blockId);
  if (index !== -1) {
    blocks.value[index] = { ...blocks.value[index], ...updates };
    emit('block-updated', blocks.value[index]);
  }
};

const deleteBlock = async (blockId: BlockId) => {
  const success = await blockService.deleteBlock(blockId);
  if (success) {
    blocks.value = blocks.value.filter(block => block.id !== blockId);
    selectedBlocks.value = selectedBlocks.value.filter(id => id !== blockId);
    emit('block-deleted', blockId);
  }
};

const updateBlockProperties = (blockId: BlockId, properties: Partial<BlockSettings & BlockProps & BlockStyle>) => {
  updateBlock(blockId, properties);
};

const handleDragStart = (blockId: BlockId, event: DragEvent) => {
  isDragging.value = true;
  dragStartPosition.value = { x: event.clientX, y: event.clientY };
  event.dataTransfer?.setData('text/plain', blockId.toString());
};

const handleDragEnd = () => {
  isDragging.value = false;
  dragStartPosition.value = null;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const blockId = event.dataTransfer?.getData('text/plain');
  if (!blockId) return;

  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  updateBlock(blockId, { position: { x, y } });
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleCanvasClick = (event: MouseEvent) => {
  // Снимаем выделение при клике на пустое место
  if (event.target === event.currentTarget) {
    selectedBlocks.value = [];
  }
};

// Обработка клавиатуры
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Delete' && selectedBlocks.value.length > 0) {
    selectedBlocks.value.forEach(blockId => deleteBlock(blockId));
  }
};

// Жизненный цикл
onMounted(() => {
  loadBlocks();
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.block-builder {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.block-builder__toolbar {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background: #f0f0f0;
  border-color: #999;
}

.block-builder__canvas {
  flex: 1;
  position: relative;
  overflow: auto;
  background: #fafafa;
  background-image: 
    linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.block-builder__properties {
  width: 300px;
  background: white;
  border-left: 1px solid #e0e0e0;
  padding: 16px;
  overflow-y: auto;
}

.is-dragging .block-builder__canvas {
  cursor: grabbing;
}
</style>
