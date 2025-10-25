<template>
  <div class="block-builder-app">
    <!-- Панель управления -->
    <div class="block-builder-controls">
      <button
        @click="handleSave"
        class="block-builder-btn block-builder-btn--success"
      >
        💾 Сохранить
      </button>
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
            :data-block-id="block.id"
            :style="getBlockSpacingStyles(block)"
          >
            <!-- Заголовок блока -->
            <div class="block-builder-block-header">
              <div class="block-builder-block-info">
                <span>📦 {{ getBlockTitle(block) }}</span>
                <small class="block-builder-block-id">
                  ID: {{ block.id }}
                  <button
                    @click="handleCopyId(block.id)"
                    class="block-builder-copy-id-btn"
                    title="Копировать ID"
                  >
                    📋
                  </button>
                </small>
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
                  :title="getBlockLockTooltip(block)"
                >
                  {{ getBlockLockIcon(block) }}
                </button>
                <button
                  @click="handleToggleVisibility(block.id)"
                  class="block-builder-control-btn"
                  :title="getBlockVisibilityTooltip(block)"
                >
                  {{ getBlockVisibilityIcon(block) }}
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
                v-bind="getUserComponentProps(block)"
              />
              <div v-else class="block-content-fallback">
                <strong>{{ getBlockTitle(block) }}</strong>
                <pre>{{ JSON.stringify(getUserComponentProps(block), null, 2) }}</pre>
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
              :class="{ 'error': formErrors[field.field] }"
              :data-field-name="field.field"
            >
              <!-- Лейбл только для полей без собственного лейбла (spacing и repeater имеют свой) -->
              <label
                v-if="isRegularInputField(field)"
                :for="'field-' + field.field"
                class="block-builder-form-label"
              >
                {{ field.label }}
                <span v-if="isFieldRequired(field)" class="required">*</span>
              </label>

              <!-- Text input -->
              <input
                v-if="field.type === 'text'"
                v-model="formData[field.field]"
                type="text"
                :id="'field-' + field.field"
                :placeholder="field.placeholder"
                class="block-builder-form-control"
                :class="{ 'error': formErrors[field.field] }"
              />

              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                v-model="formData[field.field]"
                :id="'field-' + field.field"
                :placeholder="field.placeholder"
                rows="4"
                class="block-builder-form-control"
                :class="{ 'error': formErrors[field.field] }"
              ></textarea>

              <!-- Number -->
              <input
                v-else-if="field.type === 'number'"
                v-model.number="formData[field.field]"
                type="number"
                :id="'field-' + field.field"
                :placeholder="field.placeholder"
                class="block-builder-form-control"
                :class="{ 'error': formErrors[field.field] }"
              />

              <!-- Color -->
              <input
                v-else-if="field.type === 'color'"
                v-model="formData[field.field]"
                type="color"
                :id="'field-' + field.field"
                class="block-builder-form-control"
                :class="{ 'error': formErrors[field.field] }"
              />

              <!-- Select -->
              <select
                v-else-if="field.type === 'select'"
                v-model="formData[field.field]"
                :id="'field-' + field.field"
                class="block-builder-form-control"
                :class="{ 'error': formErrors[field.field] }"
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

              <!-- Spacing Control -->
              <SpacingControl
                v-else-if="field.type === 'spacing'"
                :label="field.label"
                :field-name="field.field"
                v-model="formData[field.field]"
                :spacing-types="field.spacingConfig?.spacingTypes"
                :min="field.spacingConfig?.min"
                :max="field.spacingConfig?.max"
                :step="field.spacingConfig?.step"
                :breakpoints="field.spacingConfig?.breakpoints"
                :required="isFieldRequired(field)"
                :show-preview="true"
              />

              <!-- Repeater Control -->
              <RepeaterControl
                v-else-if="field.type === 'repeater'"
                :ref="createRepeaterRefCallback(field.field)"
                :field-name="field.field"
                :label="field.label"
                v-model="formData[field.field]"
                :fields="field.repeaterConfig?.fields || []"
                :rules="field.rules || []"
                :errors="formErrors"
                :add-button-text="field.repeaterConfig?.addButtonText"
                :remove-button-text="field.repeaterConfig?.removeButtonText"
                :item-title="field.repeaterConfig?.itemTitle"
                :min="field.repeaterConfig?.min"
                :max="field.repeaterConfig?.max"
                :default-item-value="field.repeaterConfig?.defaultItemValue"
                :collapsible="field.repeaterConfig?.collapsible"
              />

              <!-- API Select Field -->
              <ApiSelectField
                v-else-if="field.type === 'api-select' && props.apiSelectUseCase"
                :config="field"
                v-model="formData[field.field]"
                :validation-error="formErrors[field.field]?.[0]"
                :api-select-use-case="props.apiSelectUseCase"
              />

              <!-- Ошибки валидации (общие для всех типов полей) -->
              <div v-if="formErrors[field.field]" class="block-builder-form-errors">
                <span v-for="error in formErrors[field.field]" :key="error" class="error">{{ error }}</span>
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
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { IBlock, TBlockId } from '../../core/types';
import { BlockManagementUseCase } from '../../core/use-cases/BlockManagementUseCase';
import { IBlockRepository } from '../../core/ports/BlockRepository';
import { IComponentRegistry } from '../../core/ports/ComponentRegistry';
import { MemoryBlockRepositoryImpl } from '../../infrastructure/repositories/MemoryBlockRepositoryImpl';
import type { ApiSelectUseCase } from '../../core/use-cases/ApiSelectUseCase';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { UniversalValidator } from '../../utils/universalValidation';
import { addSpacingFieldToFields } from '../../utils/blockSpacingHelpers';
import { getBlockInlineStyles, watchBreakpointChanges } from '../../utils/breakpointHelpers';
import { ISpacingData } from '../../utils/spacingHelpers';
import { scrollToFirstError, parseErrorKey } from '../../utils/formErrorHelpers';
import SpacingControl from './SpacingControl.vue';
import RepeaterControl from './RepeaterControl.vue';
import ApiSelectField from './ApiSelectField.vue';

interface IBlockType {
  type: string;
  label: string;
  title?: string;
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
  apiSelectUseCase?: ApiSelectUseCase;
  onSave?: (blocks: IBlock[]) => Promise<boolean> | boolean;
  initialBlocks?: IBlock[];
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
const formErrors = reactive<Record<string, string[]>>({});
const repeaterRefs = new Map<string, any>();

// Функция для установки ref к RepeaterControl компонентам
const setRepeaterRef = (fieldName: string, el: any): void => {
  if (el) {
    repeaterRefs.set(fieldName, el);
  } else {
    repeaterRefs.delete(fieldName);
  }
};

// Хелпер-функция для создания ref коллбека с типом (обходит ограничение Vue на inline типы)
const createRepeaterRefCallback = (fieldName: string) => {
  return (el: any) => setRepeaterRef(fieldName, el);
};

// Вычисляемые свойства
const availableBlockTypes = computed(() => props.config?.availableBlockTypes || []);

const currentBlockType = computed(() => {
  if (!currentType.value) return null;
  return availableBlockTypes.value.find(bt => bt.type === currentType.value) || null;
});

// Текущие поля формы (с автоматическим добавлением spacing)
const currentBlockFields = computed(() => {
  if (!currentBlockType.value) return [];
  const blockType = currentBlockType.value;

  // Автоматически добавляем spacing поле, если его нет
  return addSpacingFieldToFields(
    blockType.fields || [],
    (blockType as any).spacingOptions
  );
});

// ===== Computed свойства для темплейтов (убираем логику из разметки) =====

/**
 * Получить заголовок блока
 */
const getBlockTitle = (block: IBlock): string => {
  return getBlockConfig(block.type)?.title || block.type;
};

/**
 * Получить тултип для кнопки блокировки
 */
const getBlockLockTooltip = (block: IBlock): string => {
  return block.locked ? 'Разблокировать' : 'Заблокировать';
};

/**
 * Получить иконку для кнопки блокировки
 */
const getBlockLockIcon = (block: IBlock): string => {
  return block.locked ? '🔓' : '🔒';
};

/**
 * Получить тултип для кнопки видимости
 */
const getBlockVisibilityTooltip = (block: IBlock): string => {
  return block.visible ? 'Скрыть' : 'Показать';
};

/**
 * Получить иконку для кнопки видимости
 */
const getBlockVisibilityIcon = (block: IBlock): string => {
  return block.visible ? '👁️' : '👁️‍🗨️';
};

/**
 * Проверить, является ли поле обычным инпутом
 */
const isRegularInputField = (field: any): boolean => {
  return field.type !== 'spacing' &&
         field.type !== 'repeater' &&
         field.type !== 'checkbox' &&
         field.type !== 'api-select';
};

/**
 * Проверить, является ли поле textarea
 */
const isTextareaField = (field: any): boolean => {
  return field.type === 'textarea';
};

/**
 * Проверить, является ли поле select
 */
const isSelectField = (field: any): boolean => {
  return field.type === 'select';
};

/**
 * Проверить, является ли поле checkbox
 */
const isCheckboxField = (field: any): boolean => {
  return field.type === 'checkbox';
};

/**
 * Проверить, является ли поле spacing
 */
const isSpacingField = (field: any): boolean => {
  return field.type === 'spacing';
};

/**
 * Проверить, является ли поле repeater
 */
const isRepeaterField = (field: any): boolean => {
  return field.type === 'repeater';
};

/**
 * Проверить, требуется ли поле (для отображения звездочки)
 */
const isFieldRequired = (field: any): boolean => {
  return field.rules?.some((rule: any) => rule.type === 'required') ?? false;
};

// Методы для работы с блоками
const loadBlocks = async () => {
  try {
    blocks.value = await blockService.getAllBlocks() as any;
  } catch (error) {
    console.error('Ошибка загрузки блоков:', error);
  }
};

// Загрузка начальных блоков
const loadInitialBlocks = async () => {
  if (!props.initialBlocks || props.initialBlocks.length === 0) {
    return;
  }

  try {
    for (const block of props.initialBlocks) {
      await blockService.createBlock(block as any);
    }
    console.log(`✅ Загружено ${props.initialBlocks.length} блоков из начальных данных`);
  } catch (error) {
    console.error('Ошибка загрузки начальных блоков:', error);
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
  // Сохраняем позицию перед закрытием модалки, т.к. closeTypeSelectionModal() сбрасывает её
  const position = selectedPosition.value;
  closeTypeSelectionModal();
  openCreateModal(type, position);
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
  Object.keys(formErrors).forEach(key => delete formErrors[key]);
  // Очищаем refs к repeater компонентам
  repeaterRefs.clear();
};

// Отправка формы
const handleSubmit = async () => {
  let success = false;

  if (modalMode.value === 'create') {
    success = await createBlock();
  } else {
    success = await updateBlock();
  }

  // Закрываем модалку только если успешно
  if (success) {
    closeModal();
  }
};

// Создание блока
const createBlock = async (): Promise<boolean> => {
  if (!currentType.value) return false;

  const blockType = currentBlockType.value;
  if (!blockType) return false;

  // Валидация формы с помощью UniversalValidator
  const fields = currentBlockFields.value;
  const validation = UniversalValidator.validateForm(formData, fields);

  // Очищаем старые ошибки
  Object.keys(formErrors).forEach(key => delete formErrors[key]);

  if (!validation.isValid) {
    // Копируем ошибки в reactive объект
    Object.assign(formErrors, validation.errors);
    console.log('❌ Ошибки валидации:', validation.errors);

    // Скроллим к первой ошибке и открываем аккордеон, если нужно
    await handleValidationErrors();

    return false;
  }

  try {
    const newBlock = await blockService.createBlock({
      type: currentType.value,
      props: { ...formData },
      settings: blockType.defaultSettings || {},
      render: blockType.render
    } as any);

    console.log('🔵 Блок создан:', newBlock.id, 'Позиция для вставки:', selectedPosition.value);

    // Если указана позиция, вставляем блок в нужное место
    if (selectedPosition.value !== undefined) {
      // Получаем все блоки и перемещаем новый блок на нужную позицию
      const allBlocks = await blockService.getAllBlocks() as any[];
      console.log('🔵 Все блоки до reorder:', allBlocks.map((b: any) => ({ id: b.id, order: b.order })));

      const blockIds = allBlocks.map((b: any) => b.id);
      console.log('🔵 IDs блоков:', blockIds);

      // Удаляем новый блок из конца
      const newBlockIndex = blockIds.indexOf(newBlock.id);
      if (newBlockIndex !== -1) {
        blockIds.splice(newBlockIndex, 1);
      }
      console.log('🔵 IDs после удаления нового блока:', blockIds);

      // Вставляем на нужную позицию
      blockIds.splice(selectedPosition.value, 0, newBlock.id);
      console.log('🔵 IDs после вставки на позицию', selectedPosition.value, ':', blockIds);

      // Обновляем порядок
      const reorderResult = await blockService.reorderBlocks(blockIds);
      console.log('🔵 Результат reorderBlocks:', reorderResult);

      // Проверяем, что порядок обновился
      const allBlocksAfter = await blockService.getAllBlocks() as any[];
      console.log('🔵 Все блоки после reorder:', allBlocksAfter.map((b: any) => ({ id: b.id, order: b.order })));
    }

    // Перезагружаем блоки
    await loadBlocks();

    // Перенастраиваем watchers для новых блоков
    await setupBreakpointWatchers();

    emit('block-added', newBlock as any);
    console.log('✅ Блок создан:', newBlock);
    return true;
  } catch (error) {
    console.error('Ошибка создания блока:', error);
    alert('Ошибка создания блока: ' + (error as Error).message);
    return false;
  }
};

// Обновление блока
const updateBlock = async (): Promise<boolean> => {
  if (!currentBlockId.value) return false;

  // Валидация формы с помощью UniversalValidator
  const fields = currentBlockFields.value;
  const validation = UniversalValidator.validateForm(formData, fields);

  // Очищаем старые ошибки
  Object.keys(formErrors).forEach(key => delete formErrors[key]);

  if (!validation.isValid) {
    // Копируем ошибки в reactive объект
    Object.assign(formErrors, validation.errors);
    console.log('❌ Ошибки валидации:', validation.errors);

    // Скроллим к первой ошибке и открываем аккордеон, если нужно
    await handleValidationErrors();

    return false;
  }

  try {
    const updated = await blockService.updateBlock(currentBlockId.value, {
      props: { ...formData }
    } as any);

    const index = blocks.value.findIndex(b => b.id === currentBlockId.value);
    if (index !== -1) {
      blocks.value[index] = updated as any;
    }

    // Перенастраиваем watchers после обновления блока
    await setupBreakpointWatchers();

    emit('block-updated', updated as any);
    console.log('✅ Блок обновлен:', updated);
    return true;
  } catch (error) {
    console.error('Ошибка обновления блока:', error);
    alert('Ошибка обновления блока: ' + (error as Error).message);
    return false;
  }
};

// Дублирование блока
const handleDuplicateBlock = async (id: TBlockId) => {
  try {
    const duplicated = await blockService.duplicateBlock(id);
    blocks.value.push(duplicated as any);

    // Перенастраиваем watchers после дублирования
    await setupBreakpointWatchers();

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
      // Очищаем watcher для удаляемого блока
      const unsubscribe = breakpointUnsubscribers.get(id);
      if (unsubscribe) {
        unsubscribe();
        breakpointUnsubscribers.delete(id);
      }

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
  await setupBreakpointWatchers();
};

// Переключить видимость блока
const handleToggleVisibility = async (blockId: TBlockId) => {
  const block = blocks.value.find((b) => b.id === blockId);
  if (!block) return;

  await blockService.setBlockVisible(blockId, !block.visible);
  await loadBlocks();
  await setupBreakpointWatchers();
};

// Получить конфигурацию блока по типу
const getBlockConfig = (type: string) => {
  return availableBlockTypes.value.find((bt: IBlockType) => bt.type === type);
};

// Копирование ID блока
const handleCopyId = (blockId: TBlockId) => {
  const success = copyToClipboard(blockId as string);
  if (success) {
    showNotification(`ID скопирован: ${blockId}`, 'success');
  }
};

// Показать уведомление
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const notification = document.createElement('div');
  notification.className = 'block-builder-notification';
  notification.textContent = message;

  const colors = {
    success: '#4caf50',
    error: '#dc3545',
    info: '#007bff'
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease-in-out;
  `;
  document.body.appendChild(notification);

  // Удаляем уведомление через 12 секунд
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 12000);
};

// Сохранение всех блоков
const handleSave = async () => {
  // Если колбэк сохранения не указан, показываем предупреждение
  if (!props.onSave) {
    showNotification('Функция сохранения не настроена. Передайте onSave в пропсы компонента.', 'error');
    return;
  }

  try {
    const result = await Promise.resolve(props.onSave(blocks.value));

    if (result === true) {
      showNotification('Данные успешно сохранены', 'success');
    } else {
      showNotification('Произошла ошибка при сохранении', 'error');
    }
  } catch (error) {
    console.error('Ошибка при сохранении блоков:', error);
    showNotification('Произошла ошибка при сохранении', 'error');
  }
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

// ===== Spacing Utilities =====

// Получение inline стилей для блока (margin + CSS переменные для padding)
const getBlockSpacingStyles = (block: IBlock): Record<string, string> => {
  // Проверяем, есть ли spacing в props блока
  const spacing = block.props?.spacing as ISpacingData | undefined;

  if (!spacing || Object.keys(spacing).length === 0) {
    return {};
  }

  // Получаем конфиг блока для определения breakpoints
  const blockConfig = getBlockConfig(block.type) as any;
  const breakpoints = blockConfig?.spacingOptions?.config?.breakpoints;

  return getBlockInlineStyles(spacing, 'spacing', breakpoints);
};

// Получение props для пользовательского компонента (без служебного spacing)
const getUserComponentProps = (block: IBlock): Record<string, any> => {
  if (!block.props) return {};

  // Исключаем spacing - это служебное поле для BlockBuilder
  const { spacing, ...userProps } = block.props;

  return userProps;
};

// Отслеживание изменения брекпоинтов
const breakpointUnsubscribers = new Map<TBlockId, () => void>();

// Функция для настройки отслеживания брекпоинтов для всех блоков
const setupBreakpointWatchers = async () => {
  await nextTick(); // Ждем, пока DOM обновится

  blocks.value.forEach(block => {
    const spacing = block.props?.spacing as ISpacingData | undefined;

    if (!spacing || Object.keys(spacing).length === 0) {
      return;
    }

    // Находим DOM элемент блока
    const element = document.querySelector(`[data-block-id="${block.id}"]`) as HTMLElement;

    if (!element) {
      return;
    }

    // Отписываемся от старого watcher, если есть
    const oldUnsubscribe = breakpointUnsubscribers.get(block.id);
    if (oldUnsubscribe) {
      oldUnsubscribe();
    }

    // Получаем конфиг блока для определения breakpoints
    const blockConfig = getBlockConfig(block.type) as any;
    const breakpoints = blockConfig?.spacingOptions?.config?.breakpoints;

    // Настраиваем новый watcher
    const unsubscribe = watchBreakpointChanges(element, spacing, 'spacing', breakpoints);
    breakpointUnsubscribers.set(block.id, unsubscribe);
  });
};

// Очистка всех watchers
const cleanupBreakpointWatchers = () => {
  breakpointUnsubscribers.forEach(unsubscribe => unsubscribe());
  breakpointUnsubscribers.clear();
};

/**
 * Обработка ошибок валидации
 * Скролл к первой ошибке и открытие аккордеонов
 */
const handleValidationErrors = async () => {
  await nextTick(); // Ждем, пока ошибки отрисуются в DOM

  const modalContent = document.querySelector('.block-builder-modal-body') as HTMLElement;

  if (!modalContent) {
    console.warn('[handleValidationErrors] Не найден контейнер модального окна');
    return;
  }

  // Добавляем небольшую задержку перед скроллом для стабильной позиции
  setTimeout(async () => {
    // Находим первую ошибку
    const firstErrorKey = Object.keys(formErrors)[0];
    if (!firstErrorKey) return;

    const errorInfo = parseErrorKey(firstErrorKey);

    // Если ошибка в repeater - СНАЧАЛА открываем аккордеон, ПОТОМ скроллим
    if (errorInfo.isRepeaterField && errorInfo.repeaterFieldName) {
      await openRepeaterAccordion(errorInfo.repeaterFieldName, errorInfo.repeaterIndex || 0);
      // Скролл произойдет автоматически внутри openRepeaterAccordion после раскрытия
    } else {
      // Для обычных полей скроллим сразу
      scrollToFirstError(modalContent, formErrors, {
        offset: 40,
        behavior: 'smooth',
        autoFocus: true
      });
    }
  }, 50); // Небольшая задержка для завершения отрисовки ошибок
};

/**
 * Открытие аккордеона в repeater для конкретного элемента
 */
const openRepeaterAccordion = async (repeaterFieldName: string, itemIndex: number): Promise<void> => {
  // Ждем следующий тик, чтобы убедиться, что компонент отрисован
  await nextTick();

  // Получаем ссылку на RepeaterControl компонент
  const repeaterComponent = repeaterRefs.get(repeaterFieldName);

  if (!repeaterComponent) {
    console.warn(`[openRepeaterAccordion] Не найден ref для repeater: ${repeaterFieldName}`);
    return;
  }

  // Проверяем, свернут ли элемент
  if (repeaterComponent.isItemCollapsed && repeaterComponent.isItemCollapsed(itemIndex)) {
    console.log('[openRepeaterAccordion] Раскрываем аккордеон для элемента:', itemIndex);

    // Раскрываем элемент через exposed метод
    if (repeaterComponent.expandItem) {
      repeaterComponent.expandItem(itemIndex);

      // Ждем, пока аккордеон откроется и DOM полностью обновится
      await nextTick();

      // Даем время на завершение анимации раскрытия
      await new Promise(resolve => setTimeout(resolve, 350));

      // Теперь скроллим к конкретному полю с ошибкой
      const modalContent = document.querySelector('.block-builder-modal-body') as HTMLElement;
      if (modalContent) {
        console.log('[openRepeaterAccordion] Скролл к полю после раскрытия аккордеона');
        scrollToFirstError(modalContent, formErrors, {
          offset: 40,
          behavior: 'smooth',
          autoFocus: true
        });
      }
    }
  } else {
    console.log('[openRepeaterAccordion] Элемент уже развернут, скроллим к полю');

    // Элемент уже развернут - скроллим к полю сразу
    const modalContent = document.querySelector('.block-builder-modal-body') as HTMLElement;
    if (modalContent) {
      scrollToFirstError(modalContent, formErrors, {
        offset: 40,
        behavior: 'smooth',
        autoFocus: true
      });
    }
  }
};

// Загрузка блоков
onMounted(async () => {
  // Сначала загружаем начальные блоки (если есть)
  await loadInitialBlocks();
  // Затем загружаем все блоки для отображения
  await loadBlocks();
  // Настраиваем отслеживание брекпоинтов
  await setupBreakpointWatchers();
});

// Очистка при размонтировании
onBeforeUnmount(() => {
  cleanupBreakpointWatchers();
});
</script>

<style lang="scss">
/* Импортируем общие стили Block Builder */
@use '../styles/index.scss';

/* Стили для ошибок валидации */
.block-builder-form-errors {
  margin-top: 4px;
  font-size: 12px;

  .error {
    display: block;
    color: var(--bb-color-danger, #dc3545);
    margin-bottom: 2px;
  }
}

.block-builder-form-control.error {
  border-color: var(--bb-color-danger, #dc3545);

  &:focus {
    border-color: var(--bb-color-danger, #dc3545);
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
  }
}

/* Анимация подсветки поля с ошибкой */
:global(.field-error-highlight) {
  animation: errorPulse 0.6s ease-in-out;
}

@keyframes errorPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(220, 53, 69, 0.3);
  }
}
</style>
