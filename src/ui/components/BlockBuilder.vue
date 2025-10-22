<template>
  <div class="block-builder">
    <!-- Панель добавления блоков -->
    <div class="block-builder__toolbar">
      <h2>Добавить блок</h2>
      <div class="toolbar-buttons">
        <button
          v-for="blockType in availableBlockTypes"
          :key="blockType.type"
          @click="openCreateModal(blockType.type)"
          class="toolbar-button"
        >
          + {{ blockType.label }}
        </button>
      </div>
    </div>

    <!-- Список блоков -->
    <div class="block-builder__list">
      <div v-if="blocks.length === 0" class="empty-state">
        <p>Добавьте первый блок используя кнопки выше</p>
      </div>

      <div
        v-for="(block, index) in blocks"
        :key="block.id"
        class="block-item"
      >
        <!-- Контролы блока -->
        <div class="block-controls">
          <button 
            @click="handleMoveUp(block.id)" 
            class="control-btn" 
            title="Переместить вверх"
            :disabled="index === 0"
          >
            ⬆️
          </button>
          <button 
            @click="handleMoveDown(block.id)" 
            class="control-btn" 
            title="Переместить вниз"
            :disabled="index === blocks.length - 1"
          >
            ⬇️
          </button>
          <button @click="openEditModal(block)" class="control-btn" title="Редактировать">
            ✏️
          </button>
          <button @click="handleDuplicateBlock(block.id)" class="control-btn" title="Дублировать">
            📋
          </button>
          <button @click="handleDeleteBlock(block.id)" class="control-btn delete" title="Удалить">
            🗑️
          </button>
        </div>

        <!-- Рендер блока -->
        <div class="block-content">
          <component
            v-if="isVueComponent(block)"
            :is="getVueComponent(block)"
            v-bind="block.props"
          />
          <div v-else>Блок {{ block.type }}</div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ modalMode === 'create' ? 'Создать' : 'Редактировать' }} {{ currentBlockType?.label }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div
              v-for="field in currentBlockFields"
              :key="field.field"
              class="form-field"
            >
              <label>{{ field.label }}</label>
              
              <!-- Text input -->
              <input
                v-if="field.type === 'text'"
                v-model="formData[field.field]"
                type="text"
                :placeholder="field.placeholder"
              />
              
              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                v-model="formData[field.field]"
                :placeholder="field.placeholder"
                rows="4"
              ></textarea>
              
              <!-- Number -->
              <input
                v-else-if="field.type === 'number'"
                v-model.number="formData[field.field]"
                type="number"
              />
              
              <!-- Color -->
              <input
                v-else-if="field.type === 'color'"
                v-model="formData[field.field]"
                type="color"
              />
              
              <!-- Select -->
              <select
                v-else-if="field.type === 'select'"
                v-model="formData[field.field]"
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              
              <!-- Checkbox -->
              <label v-else-if="field.type === 'checkbox'" class="checkbox-label">
                <input
                  v-model="formData[field.field]"
                  type="checkbox"
                />
                <span>{{ field.label }}</span>
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

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">
                Отмена
              </button>
              <button type="submit" class="btn-primary">
                {{ modalMode === 'create' ? 'Создать' : 'Сохранить' }}
              </button>
            </div>
          </form>
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
const modalMode = ref<'create' | 'edit'>('create');
const currentType = ref<string | null>(null);
const currentBlockId = ref<TBlockId | null>(null);
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
const isVueComponent = (block: IBlock) => {
  return block.render?.kind === 'component' && block.render?.framework === 'vue';
};

const getVueComponent = (block: IBlock) => {
  if (!componentRegistry) return null;
  return componentRegistry.get(block.type);
};

// Открыть модалку создания
const openCreateModal = (type: string) => {
  modalMode.value = 'create';
  currentType.value = type;
  currentBlockId.value = null;
  
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
    
    blocks.value.push(newBlock as any);
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

// Загрузка блоков
onMounted(async () => {
  try {
    blocks.value = (await blockService.getAllBlocks()) as any;
  } catch (error) {
    console.error('Ошибка загрузки блоков:', error);
  }
});
</script>

<style scoped>
.block-builder {
  width: 100%;
  background: #f8f9fa;
}

/* Toolbar */
.block-builder__toolbar {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.block-builder__toolbar h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.toolbar-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.toolbar-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Block list */
.block-builder__list {
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
  font-size: 1.1rem;
  background: white;
  border-radius: 8px;
}

.block-item {
  position: relative;
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.block-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.block-item:hover .block-controls {
  opacity: 1;
}

.block-controls {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.control-btn {
  padding: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.control-btn:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.control-btn.delete:hover {
  background: #fee;
  border-color: #fcc;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 2rem;
}

/* Form */
.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-field input[type="text"],
.form-field input[type="number"],
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-field input[type="text"]:focus,
.form-field input[type="number"]:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: #667eea;
}

.form-field input[type="color"] {
  width: 100px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.array-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.array-item h4 {
  margin: 0 0 1rem 0;
  color: #667eea;
}

.btn-remove,
.btn-add {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove {
  background: #fee;
  color: #c00;
}

.btn-remove:hover {
  background: #fcc;
}

.btn-add {
  background: #e0f0ff;
  color: #007bff;
}

.btn-add:hover {
  background: #c0e0ff;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
