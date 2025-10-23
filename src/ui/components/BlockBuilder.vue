<template>
  <div class="block-builder-app">
    <!-- Панель управления -->
    <div class="block-builder-controls">
      <button
        @click="handleClearAll"
        class="block-builder-btn block-builder-btn--danger"
      >
        🗑️ Очистить все
      </button>
    </div>

    <!-- Статистика -->
    <div class="block-builder-stats">
      <p>Всего блоков: <span>{{ blocks.length }}</span></p>
    </div>

    <!-- Список блоков -->
    <div class="block-builder-blocks">
      <!-- Пустое состояние -->
      <div v-if="blocks.length === 0" class="block-builder-empty-state">
        <div class="block-builder-add-block-separator">
          <button 
            @click="openBlockTypeSelectionModal(0)" 
            class="block-builder-add-block-btn"
            title="Добавить блок"
          >
            <span class="block-builder-add-block-btn__icon">+</span>
            <span class="block-builder-add-block-btn__text">Добавить блок</span>
          </button>
        </div>
      </div>

      <!-- Блоки с кнопками добавления -->
      <template v-else>
        <!-- Кнопка перед первым блоком -->
        <div class="block-builder-add-block-separator">
          <button 
            @click="openBlockTypeSelectionModal(0)" 
            class="block-builder-add-block-btn"
            title="Добавить блок"
          >
            <span class="block-builder-add-block-btn__icon">+</span>
            <span class="block-builder-add-block-btn__text">Добавить блок</span>
          </button>
        </div>

        <template v-for="(block, index) in blocks" :key="block.id">
          <div
            class="block-builder-block"
            :class="{ locked: block.locked, hidden: !block.visible }"
          >
            <!-- Заголовок блока -->
            <div class="block-builder-block-header">
              <div class="block-builder-block-info">
                <span>📦 {{ getBlockConfig(block.type)?.title || block.type }}</span>
                <small>ID: {{ block.id }}</small>
                <span v-if="block.locked" class="locked-indicator">🔒</span>
                <span v-if="!block.visible" class="hidden-indicator">👁️‍🗨️</span>
              </div>
              <div class="block-builder-block-controls">
                <button 
                  @click="handleMoveUp(block.id)" 
                  class="block-builder-control-btn" 
                  title="Переместить вверх"
                  :disabled="index === 0"
                >
                  ⬆️
                </button>
                <button 
                  @click="handleMoveDown(block.id)" 
                  class="block-builder-control-btn" 
                  title="Переместить вниз"
                  :disabled="index === blocks.length - 1"
                >
                  ⬇️
                </button>
                <button 
                  @click="openEditModal(block)" 
                  class="block-builder-control-btn" 
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button 
                  @click="handleDuplicateBlock(block.id)" 
                  class="block-builder-control-btn" 
                  title="Дублировать"
                >
                  📋
                </button>
                <button 
                  @click="handleToggleLock(block.id)" 
                  class="block-builder-control-btn" 
                  :title="block.locked ? 'Разблокировать' : 'Заблокировать'"
                >
                  {{ block.locked ? '🔓' : '🔒' }}
                </button>
                <button 
                  @click="handleToggleVisibility(block.id)" 
                  class="block-builder-control-btn" 
                  :title="block.visible ? 'Скрыть' : 'Показать'"
                >
                  {{ block.visible ? '👁️' : '👁️‍🗨️' }}
                </button>
                <button 
                  @click="handleDeleteBlock(block.id)" 
                  class="block-builder-control-btn" 
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
            </div>

            <!-- Содержимое блока -->
            <div class="block-builder-block-content">
              <component
                v-if="isVueComponent(block)"
                :is="getVueComponent(block)"
                v-bind="block.props"
              />
              <div v-else class="block-content-fallback">
                <strong>{{ getBlockConfig(block.type)?.title || block.type }}</strong>
                <pre>{{ JSON.stringify(block.props, null, 2) }}</pre>
              </div>
            </div>
          </div>

          <!-- Кнопка после каждого блока -->
          <div class="block-builder-add-block-separator">
            <button 
              @click="openBlockTypeSelectionModal(index + 1)" 
              class="block-builder-add-block-btn"
              title="Добавить блок"
            >
              <span class="block-builder-add-block-btn__icon">+</span>
              <span class="block-builder-add-block-btn__text">Добавить блок</span>
            </button>
          </div>
        </template>
      </template>
    </div>

    <!-- Модальное окно выбора типа блока -->
    <div v-if="showTypeSelectionModal" class="block-builder-modal" @click="closeTypeSelectionModal">
      <div class="block-builder-modal-content" @click.stop>
        <div class="block-builder-modal-header">
          <h3>Выберите тип блока</h3>
          <button @click="closeTypeSelectionModal" class="block-builder-modal-close">×</button>
        </div>
        
        <div class="block-builder-modal-body">
          <div class="block-builder-block-type-selection">
            <button
              v-for="blockType in availableBlockTypes"
              :key="blockType.type"
              @click="selectBlockType(blockType.type)"
              class="block-builder-block-type-card"
            >
              <span class="block-builder-block-type-card__icon">
                {{ getBlockConfig(blockType.type)?.icon || '📦' }}
              </span>
              <span class="block-builder-block-type-card__title">
                {{ blockType.label }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования -->
    <div v-if="showModal" class="block-builder-modal" @click="closeModal">
      <div class="block-builder-modal-content" @click.stop>
        <div class="block-builder-modal-header">
          <h3>{{ modalMode === 'create' ? 'Создать' : 'Редактировать' }} {{ currentBlockType?.label }}</h3>
          <button @click="closeModal" class="block-builder-modal-close">×</button>
        </div>
        
        <div class="block-builder-modal-body">
          <form @submit.prevent="handleSubmit" class="block-builder-form">
            <div
              v-for="field in currentBlockFields"
              :key="field.field"
              class="block-builder-form-group"
            >
              <label :for="'field-' + field.field" class="block-builder-form-label">
                {{ field.label }}
                <span v-if="field.rules?.some(r => r.type === 'required')" class="required">*</span>
              </label>
              
              <!-- Text input -->
              <input
                v-if="field.type === 'text'"
                v-model="formData[field.field]"
                type="text"
                :id="'field-' + field.field"
                :placeholder="field.placeholder"
                class="block-builder-form-control"
              />
              
              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                v-model="formData[field.field]"
                :id="'field-' + field.field"
                :placeholder="field.placeholder"
                rows="4"
                class="block-builder-form-control"
              ></textarea>
              
              <!-- Number -->
              <input
                v-else-if="field.type === 'number'"
                v-model.number="formData[field.field]"
                type="number"
                :id="'field-' + field.field"
                :placeholder="field.placeholder"
                class="block-builder-form-control"
              />
              
              <!-- Color -->
              <input
                v-else-if="field.type === 'color'"
                v-model="formData[field.field]"
                type="color"
                :id="'field-' + field.field"
                class="block-builder-form-control"
              />
              
              <!-- Select -->
              <select
                v-else-if="field.type === 'select'"
                v-model="formData[field.field]"
                :id="'field-' + field.field"
                class="block-builder-form-control"
              >
                <option value="">Выберите...</option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              
              <!-- Checkbox -->
              <label v-else-if="field.type === 'checkbox'" class="block-builder-form-checkbox">
                <input
                  v-model="formData[field.field]"
                  type="checkbox"
                  :id="'field-' + field.field"
                  class="block-builder-form-checkbox-input"
                />
                <span class="block-builder-form-checkbox-label">{{ field.label }}</span>
              </label>

              <!-- Array (для cards) -->
              <div v-else-if="field.type === 'array' && field.itemFields">
                <div
                  v-for="(item, idx) in formData[field.field]"
                  :key="idx"
                  class="array-item"
                >
                  <h4>{{ field.itemLabel || 'Элемент' }} {{ idx + 1 }}</h4>
                  <div
                    v-for="itemField in field.itemFields"
                    :key="itemField.field"
                    class="form-field"
                  >
                    <label>{{ itemField.label }}</label>
                    <input
                      v-if="itemField.type === 'text'"
                      v-model="item[itemField.field]"
                      type="text"
                      :placeholder="itemField.placeholder"
                    />
                    <textarea
                      v-else-if="itemField.type === 'textarea'"
                      v-model="item[itemField.field]"
                      :placeholder="itemField.placeholder"
                      rows="2"
                    ></textarea>
                  </div>
                  <button type="button" @click="removeArrayItem(field.field, idx)" class="btn-remove">
                    Удалить
                  </button>
                </div>
                <button type="button" @click="addArrayItem(field)" class="btn-add">
                  + Добавить {{ field.itemLabel || 'элемент' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="block-builder-modal-footer">
          <button type="button" @click="closeModal" class="block-builder-btn block-builder-btn--secondary">
            Отмена
          </button>
          <button type="submit" @click="handleSubmit" class="block-builder-btn block-builder-btn--primary">
            {{ modalMode === 'create' ? 'Создать' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { IBlock, TBlockId } from '../../core/types';
import { BlockManagementUseCase } from '../../core/use-cases/BlockManagementUseCase';
import { IBlockRepository } from '../../core/ports/BlockRepository';
import { IComponentRegistry } from '../../core/ports/ComponentRegistry';
import { MemoryBlockRepositoryImpl } from '../../infrastructure/repositories/MemoryBlockRepositoryImpl';

interface IBlockType {
  type: string;
  label: string;
  icon?: string;
  render?: any;
  defaultSettings?: any;
  defaultProps?: any;
  fields?: any[];
}

interface IProps {
  config?: {
    availableBlockTypes?: IBlockType[];
  };
  blockRepository?: IBlockRepository;
  componentRegistry?: IComponentRegistry;
}

const props = withDefaults(defineProps<IProps>(), {
  config: () => ({ availableBlockTypes: [] })
});

const emit = defineEmits<{
  'block-added': [block: IBlock];
  'block-updated': [block: IBlock];
  'block-deleted': [blockId: TBlockId];
}>();

// Инициализация
const blockRepository = props.blockRepository || new MemoryBlockRepositoryImpl();
const componentRegistry = props.componentRegistry;
const blockService = new BlockManagementUseCase(blockRepository, componentRegistry as any);

// Состояние
const blocks = ref<IBlock[]>([]);
const showModal = ref(false);
const showTypeSelectionModal = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const currentType = ref<string | null>(null);
const currentBlockId = ref<TBlockId | null>(null);
const selectedPosition = ref<number | undefined>(undefined);
const formData = reactive<Record<string, any>>({});

// Вычисляемые свойства
const availableBlockTypes = computed(() => props.config?.availableBlockTypes || []);

const currentBlockType = computed(() => {
  if (!currentType.value) return null;
  return availableBlockTypes.value.find(bt => bt.type === currentType.value) || null;
});

const currentBlockFields = computed(() => {
  return currentBlockType.value?.fields || [];
});

// Методы для работы с блоками
const loadBlocks = async () => {
  try {
    blocks.value = await blockService.getAllBlocks() as any;
  } catch (error) {
    console.error('Ошибка загрузки блоков:', error);
  }
};

const isVueComponent = (block: IBlock) => {
  return block.render?.kind === 'component' && block.render?.framework === 'vue';
};

const getVueComponent = (block: IBlock) => {
  if (!componentRegistry) return null;
  return componentRegistry.get(block.type);
};

// Открыть модалку выбора типа блока
const openBlockTypeSelectionModal = (position?: number) => {
  selectedPosition.value = position;
  showTypeSelectionModal.value = true;
};

// Закрыть модалку выбора типа блока
const closeTypeSelectionModal = () => {
  showTypeSelectionModal.value = false;
  selectedPosition.value = undefined;
};

// Выбрать тип блока из модалки
const selectBlockType = (type: string) => {
  closeTypeSelectionModal();
  openCreateModal(type, selectedPosition.value);
};

// Открыть модалку создания
const openCreateModal = (type: string, position?: number) => {
  modalMode.value = 'create';
  currentType.value = type;
  currentBlockId.value = null;
  selectedPosition.value = position;
  
  // Заполняем форму дефолтными значениями
  Object.keys(formData).forEach(key => delete formData[key]);
  const blockType = currentBlockType.value;
  blockType?.fields?.forEach((field: any) => {
    formData[field.field] = field.defaultValue;
  });
  
  showModal.value = true;
};

// Открыть модалку редактирования
const openEditModal = (block: IBlock) => {
  modalMode.value = 'edit';
  currentType.value = block.type;
  currentBlockId.value = block.id;
  
  // Заполняем форму текущими значениями
  Object.keys(formData).forEach(key => delete formData[key]);
  Object.assign(formData, { ...block.props });
  
  showModal.value = true;
};

// Закрыть модалку
const closeModal = () => {
  showModal.value = false;
  currentType.value = null;
  currentBlockId.value = null;
  Object.keys(formData).forEach(key => delete formData[key]);
};

// Отправка формы
const handleSubmit = async () => {
  if (modalMode.value === 'create') {
    await createBlock();
  } else {
    await updateBlock();
  }
  closeModal();
};

// Создание блока
const createBlock = async () => {
  if (!currentType.value) return;
  
  const blockType = currentBlockType.value;
  if (!blockType) return;
  
  try {
    const newBlock = await blockService.createBlock({
      type: currentType.value,
      props: { ...formData },
      settings: blockType.defaultSettings || {},
      render: blockType.render
    } as any);
    
    // Если указана позиция, вставляем блок в нужное место
    if (selectedPosition.value !== undefined) {
      blocks.value.splice(selectedPosition.value, 0, newBlock as any);
    } else {
      blocks.value.push(newBlock as any);
    }
    
    emit('block-added', newBlock as any);
    console.log('✅ Блок создан:', newBlock);
  } catch (error) {
    console.error('Ошибка создания блока:', error);
    alert('Ошибка создания блока: ' + (error as Error).message);
  }
};

// Обновление блока
const updateBlock = async () => {
  if (!currentBlockId.value) return;
  
  try {
    const updated = await blockService.updateBlock(currentBlockId.value, {
      props: { ...formData }
    } as any);
    
    const index = blocks.value.findIndex(b => b.id === currentBlockId.value);
    if (index !== -1) {
      blocks.value[index] = updated as any;
    }
    
    emit('block-updated', updated as any);
    console.log('✅ Блок обновлен:', updated);
  } catch (error) {
    console.error('Ошибка обновления блока:', error);
    alert('Ошибка обновления блока: ' + (error as Error).message);
  }
};

// Дублирование блока
const handleDuplicateBlock = async (id: TBlockId) => {
  try {
    const duplicated = await blockService.duplicateBlock(id);
    blocks.value.push(duplicated as any);
    emit('block-added', duplicated as any);
    console.log('✅ Блок продублирован:', duplicated);
  } catch (error) {
    console.error('Ошибка дублирования:', error);
  }
};

// Удаление блока
const handleDeleteBlock = async (id: TBlockId) => {
  if (confirm('Удалить блок?')) {
    try {
      await blockService.deleteBlock(id);
      blocks.value = blocks.value.filter(b => b.id !== id);
      emit('block-deleted', id);
      console.log('✅ Блок удален:', id);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  }
};

// Перемещение блоков
const handleMoveUp = (id: TBlockId) => {
  const index = blocks.value.findIndex(b => b.id === id);
  if (index > 0) {
    const temp = blocks.value[index];
    blocks.value[index] = blocks.value[index - 1];
    blocks.value[index - 1] = temp;
  }
};

const handleMoveDown = (id: TBlockId) => {
  const index = blocks.value.findIndex(b => b.id === id);
  if (index < blocks.value.length - 1) {
    const temp = blocks.value[index];
    blocks.value[index] = blocks.value[index + 1];
    blocks.value[index + 1] = temp;
  }
};

// Переключить блокировку блока
const handleToggleLock = async (blockId: TBlockId) => {
  const block = blocks.value.find((b) => b.id === blockId);
  if (!block) return;
  
  await blockService.setBlockLocked(blockId, !block.locked);
  await loadBlocks();
};

// Переключить видимость блока
const handleToggleVisibility = async (blockId: TBlockId) => {
  const block = blocks.value.find((b) => b.id === blockId);
  if (!block) return;
  
  await blockService.setBlockVisible(blockId, !block.visible);
  await loadBlocks();
};

// Получить конфигурацию блока по типу
const getBlockConfig = (type: string) => {
  return availableBlockTypes.value.find((bt: IBlockType) => bt.type === type);
};

// Работа с массивами в формах
const addArrayItem = (field: any) => {
  if (!formData[field.field]) {
    formData[field.field] = [];
  }
  
  const newItem: Record<string, any> = {};
  field.itemFields?.forEach((itemField: any) => {
    newItem[itemField.field] = itemField.defaultValue || '';
  });
  
  formData[field.field].push(newItem);
};

const removeArrayItem = (fieldName: string, index: number) => {
  formData[fieldName].splice(index, 1);
};

// Очистка всех блоков
const handleClearAll = async () => {
  if (confirm('Удалить все блоки?')) {
    try {
      await blockRepository.clear();
      blocks.value = [];
      console.log('✅ Все блоки удалены');
    } catch (error) {
      console.error('Ошибка очистки блоков:', error);
    }
  }
};

// Загрузка блоков
onMounted(async () => {
  await loadBlocks();
});
</script>

<style lang="scss">
/* Импортируем общие стили Block Builder */
@use '../styles/index.scss';

/* Все стили уже в SCSS - дополнительные специфичные стили не нужны */
</style>
