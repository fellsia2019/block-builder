<template>
  <div class="vue3-example">
    <h1>Naberika Vue3 Example</h1>
    
    <div class="example-controls">
      <button @click="addTextBlock" class="btn btn-primary">
        Добавить текст
      </button>
      <button @click="addImageBlock" class="btn btn-secondary">
        Добавить изображение
      </button>
      <button @click="addButtonBlock" class="btn btn-success">
        Добавить кнопку
      </button>
      <button @click="clearAllBlocks" class="btn btn-danger">
        Очистить все
      </button>
      <button @click="exportBlocks" class="btn btn-info">
        Экспорт
      </button>
    </div>
    
    <div class="example-stats">
      <p>Всего блоков: {{ blocks.length }}</p>
      <p>Выбрано блоков: {{ selectedBlocks.length }}</p>
    </div>
    
    <BlockBuilder
      :config="builderConfig"
      @block-added="handleBlockAdded"
      @block-updated="handleBlockUpdated"
      @block-deleted="handleBlockDeleted"
      @blocks-reordered="handleBlocksReordered"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { BlockBuilder } from '../ui/components/BlockBuilder.vue';
import { BlockService } from '../application/services/BlockService';
import { LocalStorageBlockRepository } from '../infrastructure/repositories/LocalStorageBlockRepository';
import { Block, BlockId } from '../domain/types';

// Инициализация сервисов
const blockRepository = new LocalStorageBlockRepository();
const blockService = new BlockService(blockRepository);

// Состояние
const blocks = ref<Block[]>([]);
const selectedBlocks = ref<BlockId[]>([]);

// Конфигурация конструктора
const builderConfig = reactive({
  allowNesting: true,
  maxDepth: 5,
  availableBlockTypes: [
    {
      type: 'text',
      label: 'Text',
      template: '<div class="text-block" style="font-size: {{ settings.fontSize }}px; color: {{ settings.color }};">{{ props.content }}</div>',
      defaultSettings: { fontSize: 16, color: '#333333' },
      defaultProps: { content: 'Новый текстовый блок' }
    },
    {
      type: 'image',
      label: 'Image',
      template: '<img src="{{ props.src }}" alt="{{ props.alt }}" style="border-radius: {{ settings.borderRadius }}px;" />',
      defaultSettings: { borderRadius: 8 },
      defaultProps: { src: 'https://via.placeholder.com/300x200', alt: 'Изображение' }
    },
    {
      type: 'button',
      label: 'Button',
      template: '<button onclick="{{ props.onClick }}" style="background-color: {{ settings.backgroundColor }}; color: {{ settings.color }}; border-radius: {{ settings.borderRadius }}px; padding: {{ settings.padding }};">{{ props.text }}</button>',
      defaultSettings: { backgroundColor: '#007bff', color: '#ffffff', borderRadius: 4, padding: '8px 16px' },
      defaultProps: { text: 'Кнопка', onClick: 'alert("Привет!")' }
    }
  ]
});

// Методы
const addTextBlock = async () => {
  const block = await blockService.createBlock({
    type: 'text',
    settings: { fontSize: 18, color: '#2c3e50' },
    props: { content: 'Новый текстовый блок' },
    template: '<div class="text-block" style="font-size: {{ settings.fontSize }}px; color: {{ settings.color }}; padding: 8px;">{{ props.content }}</div>',
    position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
    size: { width: 200, height: 60 }
  });
  
  blocks.value.push(block.toJSON());
  console.log('✅ Добавлен текстовый блок:', block.id);
};

const addImageBlock = async () => {
  const block = await blockService.createBlock({
    type: 'image',
    settings: { borderRadius: 12, shadow: '0 4px 8px rgba(0,0,0,0.1)' },
    props: { 
      src: 'https://picsum.photos/300/200?random=' + Math.random(),
      alt: 'Случайное изображение'
    },
    template: '<img src="{{ props.src }}" alt="{{ props.alt }}" style="border-radius: {{ settings.borderRadius }}px; box-shadow: {{ settings.shadow }}; width: 100%; height: 100%; object-fit: cover;" />',
    position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
    size: { width: 300, height: 200 }
  });
  
  blocks.value.push(block.toJSON());
  console.log('✅ Добавлен блок изображения:', block.id);
};

const addButtonBlock = async () => {
  const block = await blockService.createBlock({
    type: 'button',
    settings: { 
      backgroundColor: '#28a745', 
      color: '#ffffff', 
      borderRadius: 6, 
      padding: '10px 20px',
      fontSize: '14px'
    },
    props: { 
      text: 'Нажми меня!', 
      onClick: `alert('Блок ${Date.now()} нажат!')`
    },
    template: '<button onclick="{{ props.onClick }}" style="background-color: {{ settings.backgroundColor }}; color: {{ settings.color }}; border-radius: {{ settings.borderRadius }}px; padding: {{ settings.padding }}; font-size: {{ settings.fontSize }}; border: none; cursor: pointer; transition: all 0.2s;">{{ props.text }}</button>',
    position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
    size: { width: 150, height: 50 }
  });
  
  blocks.value.push(block.toJSON());
  console.log('✅ Добавлена кнопка:', block.id);
};

const clearAllBlocks = async () => {
  await blockRepository.clear();
  blocks.value = [];
  selectedBlocks.value = [];
  console.log('🗑️ Все блоки удалены');
};

const exportBlocks = () => {
  const exportData = {
    blocks: blocks.value,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `naberika-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('📤 Блоки экспортированы');
};

// Обработчики событий
const handleBlockAdded = (block: Block) => {
  console.log('➕ Блок добавлен:', block.id);
};

const handleBlockUpdated = (block: Block) => {
  console.log('🔄 Блок обновлен:', block.id);
};

const handleBlockDeleted = (blockId: BlockId) => {
  console.log('🗑️ Блок удален:', blockId);
};

const handleBlocksReordered = (blocks: Block[]) => {
  console.log('📋 Блоки переупорядочены');
};

// Загрузка блоков при инициализации
const loadBlocks = async () => {
  const blockEntities = await blockService.getAllBlocks();
  blocks.value = blockEntities.map(entity => entity.toJSON());
  console.log('📋 Загружено блоков:', blocks.value.length);
};

// Инициализация
loadBlocks();
</script>

<style scoped>
.vue3-example {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.vue3-example h1 {
  margin: 0;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #dee2e6;
  color: #2c3e50;
}

.example-controls {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #dee2e6;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.example-stats {
  padding: 8px 16px;
  background: #e9ecef;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
  color: #495057;
}

.example-stats p {
  margin: 4px 0;
}
</style>
