<template>
  <div
    class="block-component"
    :class="{
      'is-selected': selected,
      'is-dragging': isDragging,
      'is-locked': block.locked,
      'is-hidden': !block.visible
    }"
    :style="blockStyle"
    @click.stop="handleClick"
    @mousedown="handleMouseDown"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    draggable="true"
  >
    <div class="block-component__content" @click="handleCardClick">
      <div v-html="renderedTemplate"></div>
    </div>
    
    <div v-if="selected" class="block-component__controls">
      <button @click.stop="handleDelete" class="control-button delete-button" title="Delete">
        ×
      </button>
      <button @click.stop="handleLock" class="control-button lock-button" :title="block.locked ? 'Unlock' : 'Lock'">
        {{ block.locked ? '🔒' : '🔓' }}
      </button>
      <button @click.stop="handleVisibility" class="control-button visibility-button" :title="block.visible ? 'Hide' : 'Show'">
        {{ block.visible ? '👁' : '👁‍🗨' }}
      </button>
    </div>
    
    <div v-if="isResizing" class="block-component__resize-handles">
      <div class="resize-handle nw" @mousedown="startResize('nw')"></div>
      <div class="resize-handle ne" @mousedown="startResize('ne')"></div>
      <div class="resize-handle sw" @mousedown="startResize('sw')"></div>
      <div class="resize-handle se" @mousedown="startResize('se')"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Block, BlockId, BlockPosition, BlockSize } from '../../domain/types';

interface Props {
  block: Block;
  selected: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [blockId: BlockId];
  update: [blockId: BlockId, updates: Partial<Block>];
  delete: [blockId: BlockId];
  'drag-start': [blockId: BlockId, event: DragEvent];
  'drag-end': [blockId: BlockId];
  'card-click': [card: any];
}>();

// Состояние
const isDragging = ref(false);
const isResizing = ref(false);
const dragStartPosition = ref<{ x: number; y: number } | null>(null);
const resizeStartData = ref<{ size: BlockSize; position: BlockPosition } | null>(null);

// Вычисляемые свойства
const blockStyle = computed(() => {
  const style: Record<string, string> = {
    position: 'absolute',
    left: `${props.block.position?.x || 0}px`,
    top: `${props.block.position?.y || 0}px`,
    width: `${props.block.size?.width || 200}px`,
    height: `${props.block.size?.height || 100}px`,
    zIndex: String(props.block.position?.z || 1),
    opacity: props.block.visible ? '1' : '0.5',
    pointerEvents: props.block.locked ? 'none' : 'auto'
  };

  // Добавляем пользовательские стили
  if (props.block.style) {
    Object.assign(style, props.block.style);
  }

  return style;
});

const renderedTemplate = computed(() => {
  let template = props.block.template;
  
  // Заменяем плейсхолдеры на значения из props
  if (typeof template === 'string') {
    Object.entries(props.block.props).forEach(([key, value]) => {
      const placeholder = `{{ props.${key} }}`;
      template = template.replace(new RegExp(placeholder, 'g'), String(value));
    });
  }
  
  return template;
});

// Методы
const handleClick = () => {
  emit('select', props.block.id);
};

const handleCardClick = (event: MouseEvent) => {
  // Останавливаем всплытие, чтобы не переключать выделение блока
  event.stopPropagation();

  const target = event.target as HTMLElement;

  // Предотвращаем переход по ссылке внутри карточки, откроем её из модалки
  const clickedAnchor = target.closest('a');
  if (clickedAnchor && clickedAnchor.classList.contains('card-button')) {
    event.preventDefault();
  }

  // Поддерживаем оба варианта класса карточки: .card-item и .card
  const cardItem = (target.closest('.card-item') || target.closest('.card')) as HTMLElement | null;

  if (cardItem && props.block.type === 'cardlist') {
    // Извлекаем данные карточки из DOM
    const title = cardItem.querySelector('h3')?.textContent || '';
    const text = cardItem.querySelector('p')?.textContent || '';
    const button = cardItem.querySelector('a')?.textContent || '';
    const link = cardItem.querySelector('a')?.getAttribute('href') || '';
    const image = cardItem.querySelector('img')?.getAttribute('src') || '';

    const card = { title, text, button, link, image };

    emit('card-click', card);
  }
};

const handleMouseDown = (event: MouseEvent) => {
  if (props.block.locked) return;
  
  dragStartPosition.value = {
    x: event.clientX - (props.block.position?.x || 0),
    y: event.clientY - (props.block.position?.y || 0)
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = (event: MouseEvent) => {
  if (!dragStartPosition.value) return;
  
  const newPosition: BlockPosition = {
    x: event.clientX - dragStartPosition.value.x,
    y: event.clientY - dragStartPosition.value.y,
    z: props.block.position?.z || 1
  };
  
  emit('update', props.block.id, { position: newPosition });
};

const handleMouseUp = () => {
  dragStartPosition.value = null;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

const handleDragStart = (event: DragEvent) => {
  if (props.block.locked) {
    event.preventDefault();
    return;
  }
  
  isDragging.value = true;
  emit('drag-start', props.block.id, event);
};

const handleDragEnd = () => {
  isDragging.value = false;
  emit('drag-end', props.block.id);
};

const handleDelete = () => {
  emit('delete', props.block.id);
};

const handleLock = () => {
  emit('update', props.block.id, { locked: !props.block.locked });
};

const handleVisibility = () => {
  emit('update', props.block.id, { visible: !props.block.visible });
};

const startResize = (direction: 'nw' | 'ne' | 'sw' | 'se') => {
  if (props.block.locked) return;
  
  isResizing.value = true;
  resizeStartData.value = {
    size: { ...props.block.size! },
    position: { ...props.block.position! }
  };
  
  const resizeHandler = (event: MouseEvent) => handleResize(event, direction);
  document.addEventListener('mousemove', resizeHandler);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (event: MouseEvent, direction: string) => {
  if (!resizeStartData.value) return;
  
  const deltaX = event.clientX - (resizeStartData.value.position.x + resizeStartData.value.size.width);
  const deltaY = event.clientY - (resizeStartData.value.position.y + resizeStartData.value.size.height);
  
  let newSize: BlockSize = { ...resizeStartData.value.size };
  let newPosition: BlockPosition = { ...resizeStartData.value.position };
  
  switch (direction) {
    case 'se':
      newSize.width = Math.max(50, resizeStartData.value.size.width + deltaX);
      newSize.height = Math.max(50, resizeStartData.value.size.height + deltaY);
      break;
    case 'sw':
      newSize.width = Math.max(50, resizeStartData.value.size.width - deltaX);
      newSize.height = Math.max(50, resizeStartData.value.size.height + deltaY);
      newPosition.x = resizeStartData.value.position.x + deltaX;
      break;
    case 'ne':
      newSize.width = Math.max(50, resizeStartData.value.size.width + deltaX);
      newSize.height = Math.max(50, resizeStartData.value.size.height - deltaY);
      newPosition.y = resizeStartData.value.position.y + deltaY;
      break;
    case 'nw':
      newSize.width = Math.max(50, resizeStartData.value.size.width - deltaX);
      newSize.height = Math.max(50, resizeStartData.value.size.height - deltaY);
      newPosition.x = resizeStartData.value.position.x + deltaX;
      newPosition.y = resizeStartData.value.position.y + deltaY;
      break;
  }
  
  emit('update', props.block.id, { size: newSize, position: newPosition });
};

const stopResize = () => {
  isResizing.value = false;
  resizeStartData.value = null;
  // Удаляем все обработчики mousemove
  document.removeEventListener('mousemove', () => {});
  document.removeEventListener('mouseup', stopResize);
};

// Очистка при размонтировании
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  // Очищаем все обработчики resize
  document.removeEventListener('mousemove', () => {});
  document.removeEventListener('mouseup', stopResize);
});
</script>

<style scoped>
.block-component {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: move;
  user-select: none;
  transition: all 0.2s ease;
}

.block-component:hover {
  border-color: #007bff;
}

.block-component.is-selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.block-component.is-dragging {
  opacity: 0.8;
  transform: rotate(2deg);
}

.block-component.is-locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.block-component.is-hidden {
  opacity: 0.3;
}

.block-component__content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 2px;
}

.block-component__controls {
  position: absolute;
  top: -30px;
  right: 0;
  display: flex;
  gap: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.control-button {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: #f0f0f0;
}

.delete-button:hover {
  background: #ff4444;
  color: white;
}

.block-component__resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #007bff;
  border: 1px solid white;
  border-radius: 50%;
  pointer-events: all;
  cursor: nw-resize;
}

.resize-handle.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}
</style>
