<template>
  <div class="vue3-example">
    <h1>Naberika Vue3 Example</h1>
    
    <div class="example-controls">
      <button @click="showCreateForm('text')" class="btn btn-primary">
        📝 Добавить текст
      </button>
      <button @click="showCreateForm('image')" class="btn btn-secondary">
        🖼️ Добавить изображение
      </button>
      <button @click="showCreateForm('button')" class="btn btn-success">
        🔘 Добавить кнопку
      </button>
      <button @click="clearAllBlocks" class="btn btn-danger">
        🗑️ Очистить все
      </button>
    </div>
    
    <div class="example-stats">
      <p>Всего блоков: {{ blocks.length }}</p>
      <p>Выбрано блоков: {{ selectedBlocks.length }}</p>
    </div>
    
    <!-- Список блоков -->
    <div class="blocks-container">
      <div
        v-for="block in blocks"
        :key="block.id"
        class="block-item"
        :class="{ 
          'selected': selectedBlocks.includes(block.id), 
          'locked': block.locked,
          'hidden': !block.visible 
        }"
        @click="selectBlock(block.id)"
      >
        <!-- Заголовок блока с кнопками управления -->
        <div class="block-header">
          <div class="block-info">
            <span class="block-type">{{ block.type }}</span>
            <span class="block-id">{{ block.id.slice(-8) }}</span>
            <span v-if="block.locked" class="lock-icon">🔒</span>
            <span v-if="!block.visible" class="hidden-icon">👁️‍🗨️</span>
          </div>
          
          <div class="block-controls" v-if="selectedBlocks.includes(block.id)">
            <button 
              class="control-btn edit-btn" 
              @click.stop="editBlock(block)"
              title="Редактировать"
            >
              ✏️
            </button>
            <button 
              class="control-btn move-up-btn" 
              @click.stop="moveBlockUp(block.id)"
              title="Переместить вверх"
            >
              ⬆️
            </button>
            <button 
              class="control-btn move-down-btn" 
              @click.stop="moveBlockDown(block.id)"
              title="Переместить вниз"
            >
              ⬇️
            </button>
            <button 
              class="control-btn toggle-visibility-btn" 
              @click.stop="toggleBlockVisibility(block.id)"
              :title="block.visible ? 'Скрыть' : 'Показать'"
            >
              {{ block.visible ? '👁️' : '👁️‍🗨️' }}
            </button>
            <button 
              class="control-btn toggle-lock-btn" 
              @click.stop="toggleBlockLock(block.id)"
              :title="block.locked ? 'Разблокировать' : 'Заблокировать'"
            >
              {{ block.locked ? '🔓' : '🔒' }}
            </button>
            <button 
              class="control-btn delete-btn" 
              @click.stop="deleteBlock(block.id)"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- Контент блока -->
        <div class="block-content" v-html="getRenderedContent(block)"></div>
      </div>
    </div>

    <!-- Диалог создания/редактирования блока -->
    <SimpleBlockFormDialog
      v-if="currentFormConfig"
      :is-visible="showFormDialog"
      :form-config="currentFormConfig"
      :initial-data="editingBlockData"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
      @close="handleFormClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import SimpleBlockFormDialog from '../ui/components/SimpleBlockFormDialog.vue';
import { FormGenerationConfig, FormData } from '../core/entities/ValidationRule';

// Простой интерфейс блока
interface SimpleBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
  props: Record<string, any>;
  template: string;
  visible: boolean;
  locked: boolean;
}

// Состояние
const blocks = ref<SimpleBlock[]>([]);
const selectedBlocks = ref<string[]>([]);
const showFormDialog = ref(false);
const currentFormConfig = ref<FormGenerationConfig | null>(null);
const editingBlockData = ref<FormData | null>(null);
const currentBlockType = ref<string>('');

// Конфигурации форм
const formConfigs: Record<string, FormGenerationConfig> = {
  'text': {
    title: 'Настройка текстового блока',
    description: 'Настройте параметры текстового блока',
    fields: [
      {
        field: 'content',
        label: 'Текст',
        type: 'textarea',
        placeholder: 'Введите текст...',
        rules: [
          { type: 'required', field: 'content', message: 'Текст обязателен для заполнения' },
          { type: 'minLength', field: 'content', value: 1, message: 'Текст не может быть пустым' }
        ],
        defaultValue: ''
      },
      {
        field: 'fontSize',
        label: 'Размер шрифта',
        type: 'number',
        rules: [
          { type: 'required', field: 'fontSize', message: 'Размер шрифта обязателен' },
          { type: 'min', field: 'fontSize', value: 8, message: 'Минимальный размер шрифта: 8px' },
          { type: 'max', field: 'fontSize', value: 72, message: 'Максимальный размер шрифта: 72px' }
        ],
        defaultValue: 16
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [
          { type: 'required', field: 'color', message: 'Цвет обязателен' }
        ],
        defaultValue: '#333333'
      },
      {
        field: 'textAlign',
        label: 'Выравнивание',
        type: 'select',
        options: [
          { value: 'left', label: 'По левому краю' },
          { value: 'center', label: 'По центру' },
          { value: 'right', label: 'По правому краю' },
          { value: 'justify', label: 'По ширине' }
        ],
        rules: [
          { type: 'required', field: 'textAlign', message: 'Выравнивание обязательно' }
        ],
        defaultValue: 'left'
      }
    ],
    submitButtonText: 'Создать блок',
    cancelButtonText: 'Отмена'
  },
  'image': {
    title: 'Настройка блока изображения',
    description: 'Настройте параметры блока изображения',
    fields: [
      {
        field: 'src',
        label: 'URL изображения',
        type: 'url',
        placeholder: 'https://example.com/image.jpg',
        rules: [
          { type: 'required', field: 'src', message: 'URL изображения обязателен' },
          { type: 'url', field: 'src', message: 'Введите корректный URL' }
        ],
        defaultValue: ''
      },
      {
        field: 'alt',
        label: 'Альтернативный текст',
        type: 'text',
        placeholder: 'Описание изображения',
        rules: [
          { type: 'required', field: 'alt', message: 'Альтернативный текст обязателен' }
        ],
        defaultValue: ''
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', field: 'borderRadius', value: 0, message: 'Скругление не может быть отрицательным' },
          { type: 'max', field: 'borderRadius', value: 50, message: 'Максимальное скругление: 50px' }
        ],
        defaultValue: 0
      }
    ],
    submitButtonText: 'Создать блок',
    cancelButtonText: 'Отмена'
  },
  'button': {
    title: 'Настройка кнопки',
    description: 'Настройте параметры кнопки',
    fields: [
      {
        field: 'text',
        label: 'Текст кнопки',
        type: 'text',
        placeholder: 'Нажми меня',
        rules: [
          { type: 'required', field: 'text', message: 'Текст кнопки обязателен' },
          { type: 'minLength', field: 'text', value: 1, message: 'Текст не может быть пустым' }
        ],
        defaultValue: 'Кнопка'
      },
      {
        field: 'backgroundColor',
        label: 'Цвет фона',
        type: 'color',
        rules: [
          { type: 'required', field: 'backgroundColor', message: 'Цвет фона обязателен' }
        ],
        defaultValue: '#007bff'
      },
      {
        field: 'color',
        label: 'Цвет текста',
        type: 'color',
        rules: [
          { type: 'required', field: 'color', message: 'Цвет текста обязателен' }
        ],
        defaultValue: '#ffffff'
      },
      {
        field: 'borderRadius',
        label: 'Скругление углов',
        type: 'number',
        rules: [
          { type: 'min', field: 'borderRadius', value: 0, message: 'Скругление не может быть отрицательным' },
          { type: 'max', field: 'borderRadius', value: 50, message: 'Максимальное скругление: 50px' }
        ],
        defaultValue: 4
      },
      {
        field: 'padding',
        label: 'Отступы',
        type: 'text',
        placeholder: '8px 16px',
        rules: [
          { type: 'required', field: 'padding', message: 'Отступы обязательны' }
        ],
        defaultValue: '8px 16px'
      },
      {
        field: 'onClick',
        label: 'Обработчик клика',
        type: 'text',
        placeholder: 'alert("Привет!")',
        rules: [
          { type: 'required', field: 'onClick', message: 'Обработчик клика обязателен' }
        ],
        defaultValue: 'alert("Привет!")'
      }
    ],
    submitButtonText: 'Создать кнопку',
    cancelButtonText: 'Отмена'
  }
};

// Методы для работы с формами
const showCreateForm = (blockType: string) => {
  currentBlockType.value = blockType;
  currentFormConfig.value = formConfigs[blockType];
  editingBlockData.value = null;
  showFormDialog.value = true;
};

const handleFormSubmit = async (data: FormData) => {
  try {
    if (editingBlockData.value) {
      // Редактирование существующего блока
      const blockId = blocks.value.find(b => 
        b.props === editingBlockData.value || 
        b.settings === editingBlockData.value
      )?.id;
      
      if (blockId) {
        updateBlockFromFormData(blockId, data);
        console.log(`✅ Блок обновлен:`, blockId);
      }
    } else {
      // Создание нового блока
      const blockType = currentBlockType.value;
      const block = createBlockFromFormData(blockType, data);
      blocks.value.push(block);
      console.log(`✅ Добавлен блок ${blockType}:`, block.id);
    }
    showFormDialog.value = false;
  } catch (error) {
    console.error('Ошибка при обработке блока:', error);
  }
};

const handleFormCancel = () => {
  showFormDialog.value = false;
};

const handleFormClose = () => {
  showFormDialog.value = false;
};

// Обработчики управления блоками
const selectBlock = (blockId: string) => {
  if (selectedBlocks.value.includes(blockId)) {
    selectedBlocks.value = selectedBlocks.value.filter(id => id !== blockId);
  } else {
    selectedBlocks.value.push(blockId);
  }
};

const editBlock = (block: SimpleBlock) => {
  currentBlockType.value = block.type;
  currentFormConfig.value = formConfigs[block.type];
  editingBlockData.value = { ...block.props, ...block.settings };
  showFormDialog.value = true;
};

const deleteBlock = (blockId: string) => {
  if (confirm('Удалить этот блок?')) {
    blocks.value = blocks.value.filter(block => block.id !== blockId);
    selectedBlocks.value = selectedBlocks.value.filter(id => id !== blockId);
    console.log('🗑️ Блок удален:', blockId);
  }
};

const moveBlockUp = (blockId: string) => {
  const index = blocks.value.findIndex(block => block.id === blockId);
  if (index > 0) {
    const block = blocks.value.splice(index, 1)[0];
    blocks.value.splice(index - 1, 0, block);
    console.log('⬆️ Блок перемещен вверх:', blockId);
  }
};

const moveBlockDown = (blockId: string) => {
  const index = blocks.value.findIndex(block => block.id === blockId);
  if (index < blocks.value.length - 1) {
    const block = blocks.value.splice(index, 1)[0];
    blocks.value.splice(index + 1, 0, block);
    console.log('⬇️ Блок перемещен вниз:', blockId);
  }
};

const toggleBlockVisibility = (blockId: string) => {
  const block = blocks.value.find(b => b.id === blockId);
  if (block) {
    block.visible = !block.visible;
    console.log(`👁️ Видимость блока изменена: ${block.visible}`, blockId);
  }
};

const toggleBlockLock = (blockId: string) => {
  const block = blocks.value.find(b => b.id === blockId);
  if (block) {
    block.locked = !block.locked;
    console.log(`🔒 Блокировка блока изменена: ${block.locked}`, blockId);
  }
};

const clearAllBlocks = () => {
  blocks.value = [];
  selectedBlocks.value = [];
  console.log('🗑️ Все блоки удалены');
};

const createBlockFromFormData = (blockType: string, data: FormData): SimpleBlock => {
  const blockId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  switch (blockType) {
    case 'text':
      return {
        id: blockId,
        type: 'text',
        settings: {
          fontSize: data.fontSize + 'px',
          color: data.color
        },
        props: {
          content: data.content,
          textAlign: data.textAlign
        },
        template: `<div style="text-align: ${data.textAlign}; font-size: ${data.fontSize}px; color: ${data.color}; padding: 10px;">${data.content}</div>`,
        visible: true,
        locked: false
      };

    case 'image':
      return {
        id: blockId,
        type: 'image',
        settings: {
          borderRadius: data.borderRadius + 'px'
        },
        props: {
          src: data.src,
          alt: data.alt
        },
        template: `<img src="${data.src}" alt="${data.alt}" style="border-radius: ${data.borderRadius}px; width: 100%; height: 100%; object-fit: cover;" />`,
        visible: true,
        locked: false
      };

    case 'button':
      return {
        id: blockId,
        type: 'button',
        settings: {
          backgroundColor: data.backgroundColor,
          color: data.color,
          borderRadius: data.borderRadius + 'px',
          padding: data.padding
        },
        props: {
          text: data.text,
          onClick: data.onClick
        },
        template: `<button onclick="${data.onClick}" style="background-color: ${data.backgroundColor}; color: ${data.color}; border-radius: ${data.borderRadius}px; padding: ${data.padding}; border: none; cursor: pointer; transition: all 0.2s;">${data.text}</button>`,
        visible: true,
        locked: false
      };

    default:
      throw new Error(`Неизвестный тип блока: ${blockType}`);
  }
};

const updateBlockFromFormData = (blockId: string, data: FormData) => {
  const block = blocks.value.find(b => b.id === blockId);
  if (!block) return;

  switch (block.type) {
    case 'text':
      block.settings = {
        fontSize: data.fontSize + 'px',
        color: data.color
      };
      block.props = {
        content: data.content,
        textAlign: data.textAlign
      };
      block.template = `<div style="text-align: ${data.textAlign}; font-size: ${data.fontSize}px; color: ${data.color}; padding: 10px;">${data.content}</div>`;
      break;

    case 'image':
      block.settings = {
        borderRadius: data.borderRadius + 'px'
      };
      block.props = {
        src: data.src,
        alt: data.alt
      };
      block.template = `<img src="${data.src}" alt="${data.alt}" style="border-radius: ${data.borderRadius}px; width: 100%; height: 100%; object-fit: cover;" />`;
      break;

    case 'button':
      block.settings = {
        backgroundColor: data.backgroundColor,
        color: data.color,
        borderRadius: data.borderRadius + 'px',
        padding: data.padding
      };
      block.props = {
        text: data.text,
        onClick: data.onClick
      };
      block.template = `<button onclick="${data.onClick}" style="background-color: ${data.backgroundColor}; color: ${data.color}; border-radius: ${data.borderRadius}px; padding: ${data.padding}; border: none; cursor: pointer; transition: all 0.2s;">${data.text}</button>`;
      break;
  }
};

const getRenderedContent = (block: SimpleBlock): string => {
  if (!block.template) return block.type;
  
  let content = block.template;
  
  // Заменяем плейсхолдеры в шаблоне
  Object.entries(block.props || {}).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{ props.${key} }}`, 'g'), String(value));
  });
  
  Object.entries(block.settings || {}).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{ settings.${key} }}`, 'g'), String(value));
  });
  
  return content;
};
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

.blocks-container {
  padding: 20px;
  background: #f8f9fa;
  min-height: 400px;
  flex: 1;
  overflow-y: auto;
}

.block-item {
  border: 2px solid #007bff;
  border-radius: 8px;
  background: rgba(0, 123, 255, 0.05);
  margin-bottom: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.block-item:hover {
  background: rgba(0, 123, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
}

.block-item.selected {
  border-color: #28a745;
  background: rgba(40, 167, 69, 0.1);
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
}

.block-item.locked {
  border-color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
}

.block-item.hidden {
  opacity: 0.3;
}

.block-header {
  background: rgba(0, 123, 255, 0.1);
  padding: 10px 15px;
  border-bottom: 1px solid #007bff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #2c3e50;
}

.block-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.block-type {
  font-weight: 600;
  text-transform: capitalize;
}

.block-id {
  font-family: monospace;
  font-size: 12px;
  color: #666;
}

.lock-icon, .hidden-icon {
  font-size: 12px;
}

.block-controls {
  display: flex;
  gap: 5px;
  align-items: center;
}

.control-btn {
  background: none;
  border: none;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.edit-btn:hover {
  background: rgba(0, 123, 255, 0.2);
}

.move-up-btn:hover, .move-down-btn:hover {
  background: rgba(40, 167, 69, 0.2);
}

.toggle-visibility-btn:hover, .toggle-lock-btn:hover {
  background: rgba(255, 193, 7, 0.2);
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.2);
}

.block-content {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #333;
  min-height: 60px;
}

/* Стили для контента блока */
.block-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.block-content :deep(button) {
  cursor: pointer;
}

.block-content :deep(div) {
  width: 100%;
}
</style>
