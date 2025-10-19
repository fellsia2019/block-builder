<template>
  <div 
    class="block-item" 
    :class="{ 
      'selected': isSelected, 
      'locked': block.locked,
      'hidden': !block.visible 
    }"
    @click="selectBlock"
  >
    <!-- Заголовок блока с кнопками управления -->
    <div class="block-header">
      <div class="block-info">
        <span class="block-type">{{ block.type }}</span>
        <span class="block-id">{{ block.id.slice(-8) }}</span>
        <span v-if="block.locked" class="lock-icon">🔒</span>
        <span v-if="!block.visible" class="hidden-icon">👁️‍🗨️</span>
      </div>
      
      <div class="block-controls" v-if="isSelected">
        <button 
          class="control-btn edit-btn" 
          @click.stop="editBlock"
          title="Редактировать"
        >
          ✏️
        </button>
        <button 
          class="control-btn move-up-btn" 
          @click.stop="moveUp"
          title="Переместить вверх"
        >
          ⬆️
        </button>
        <button 
          class="control-btn move-down-btn" 
          @click.stop="moveDown"
          title="Переместить вниз"
        >
          ⬇️
        </button>
        <button 
          class="control-btn toggle-visibility-btn" 
          @click.stop="toggleVisibility"
          :title="block.visible ? 'Скрыть' : 'Показать'"
        >
          {{ block.visible ? '👁️' : '👁️‍🗨️' }}
        </button>
        <button 
          class="control-btn toggle-lock-btn" 
          @click.stop="toggleLock"
          :title="block.locked ? 'Разблокировать' : 'Заблокировать'"
        >
          {{ block.locked ? '🔓' : '🔒' }}
        </button>
        <button 
          class="control-btn delete-btn" 
          @click.stop="deleteBlock"
          title="Удалить"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Контент блока -->
    <div class="block-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Block } from '../../core/entities/Block';

interface Props {
  block: Block;
  isSelected: boolean;
}

interface Emits {
  (e: 'select', blockId: string): void;
  (e: 'edit', block: Block): void;
  (e: 'delete', blockId: string): void;
  (e: 'move-up', blockId: string): void;
  (e: 'move-down', blockId: string): void;
  (e: 'toggle-visibility', blockId: string): void;
  (e: 'toggle-lock', blockId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Рендерим контент блока
const renderedContent = computed(() => {
  if (!props.block.template) return props.block.type;
  
  let content = props.block.template;
  
  // Заменяем плейсхолдеры в шаблоне
  Object.entries(props.block.props || {}).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{ props.${key} }}`, 'g'), String(value));
  });
  
  Object.entries(props.block.settings || {}).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{ settings.${key} }}`, 'g'), String(value));
  });
  
  return content;
});

const selectBlock = () => {
  emit('select', props.block.id);
};

const editBlock = () => {
  emit('edit', props.block);
};

const deleteBlock = () => {
  if (confirm(`Удалить блок "${props.block.type}"?`)) {
    emit('delete', props.block.id);
  }
};

const moveUp = () => {
  emit('move-up', props.block.id);
};

const moveDown = () => {
  emit('move-down', props.block.id);
};

const toggleVisibility = () => {
  emit('toggle-visibility', props.block.id);
};

const toggleLock = () => {
  emit('toggle-lock', props.block.id);
};
</script>

<style scoped>
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
