<template>
  <div
    class="block-component"
    :class="{
      'is-locked': block.locked,
      'is-hidden': !block.visible
    }"
    :style="blockStyle"
    @click.stop="handleClick"
  >
    <div class="block-component__content" @click="handleCardClick">
      <div v-html="renderedTemplate"></div>
    </div>
    
    <div class="block-component__controls">
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
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IBlock, TBlockId } from '../../core/entities/Block';

interface Props {
  block: IBlock;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  update: [blockId: TBlockId, updates: Partial<IBlock>];
  delete: [blockId: TBlockId];
  'card-click': [card: any];
}>();

// Состояние

// Вычисляемые свойства
const blockStyle = computed(() => {
  const style: Record<string, string> = {
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
const handleClick = () => {};

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


const handleDelete = () => {
  emit('delete', props.block.id);
};

const handleLock = () => {
  emit('update', props.block.id, { locked: !props.block.locked });
};

const handleVisibility = () => {
  emit('update', props.block.id, { visible: !props.block.visible });
};

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

</style>
