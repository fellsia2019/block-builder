<!--
  SpacingControl - Компонент для управления отступами блока с поддержкой брекпоинтов
  Используется в формах создания и редактирования блоков
-->
<template>
  <div class="spacing-control">
    <div class="spacing-control__header">
      <label class="spacing-control__label">
        {{ label }}
        <span v-if="required" class="required">*</span>
      </label>
    </div>

    <!-- Переключатель брекпоинтов -->
    <div class="spacing-control__breakpoints">
      <button
        v-for="bp in allBreakpoints"
        :key="bp.name"
        type="button"
        class="spacing-control__breakpoint-btn"
        :class="{ 'spacing-control__breakpoint-btn--active': currentBreakpoint === bp.name }"
        @click="currentBreakpoint = bp.name"
      >
        {{ bp.label }}
      </button>
    </div>

    <!-- Группы контролов для каждого типа отступа -->
    <div class="spacing-control__groups">
      <div
        v-for="spacingType in availableSpacingTypes"
        :key="spacingType"
        class="spacing-control__group"
      >
        <label :for="getFieldId(spacingType)" class="spacing-control__group-label">
          {{ getSpacingLabel(spacingType) }}
        </label>

        <div class="spacing-control__slider-wrapper">
          <input
            :id="getFieldId(spacingType)"
            type="range"
            class="spacing-control__slider"
            :min="minValue"
            :max="maxValue"
            :step="stepValue"
            :value="getSpacingValue(spacingType)"
            @input="handleSpacingChange(spacingType, $event)"
          />
          <div class="spacing-control__track">
            <div
              class="spacing-control__track-fill"
              :style="{ width: getTrackFillWidth(spacingType) }"
            ></div>
            <div
              class="spacing-control__thumb"
              :style="{ left: getTrackFillWidth(spacingType) }"
            ></div>
          </div>
          <input
            type="number"
            class="spacing-control__value-input"
            :min="minValue"
            :max="maxValue"
            :step="stepValue"
            :value="getSpacingValue(spacingType)"
            @input="handleValueInputChange(spacingType, $event)"
          />
          <span class="spacing-control__unit">px</span>
        </div>
      </div>
    </div>

    <!-- Превью CSS переменных -->
    <div v-if="showPreview" class="spacing-control__preview">
      <div class="spacing-control__preview-title">CSS переменные:</div>
      <pre class="spacing-control__preview-code">{{ getCSSVariablesPreview() }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';

// Базовые брекпоинты по умолчанию
const DEFAULT_BREAKPOINTS = [
  { name: 'desktop', label: 'Десктоп', maxWidth: undefined },
  { name: 'tablet', label: 'Таблет', maxWidth: 1199 },
  { name: 'mobile', label: 'Моб', maxWidth: 767 }
];

// Все доступные типы отступов
const ALL_SPACING_TYPES = ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom'];

export default {
  name: 'SpacingControl',
  props: {
    label: {
      type: String,
      default: 'Отступы'
    },
    fieldName: {
      type: String,
      required: true
    },
    modelValue: {
      type: Object,
      default: () => ({})
    },
    spacingTypes: {
      type: Array,
      default: () => ALL_SPACING_TYPES
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 200
    },
    step: {
      type: Number,
      default: 1
    },
    breakpoints: {
      type: Array,
      default: null
    },
    useDefaultBreakpoints: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    showPreview: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const spacingData = ref({});

    // Вычисляемые свойства
    const allBreakpoints = computed(() => {
      if (props.breakpoints && props.breakpoints.length > 0) {
        return props.useDefaultBreakpoints
          ? [...DEFAULT_BREAKPOINTS, ...props.breakpoints]
          : props.breakpoints;
      }
      return DEFAULT_BREAKPOINTS;
    });

    // Инициализируем текущий брекпоинт (будет установлен в onMounted)
    const currentBreakpoint = ref('');

    const availableSpacingTypes = computed(() => {
      return props.spacingTypes && props.spacingTypes.length > 0
        ? props.spacingTypes
        : ALL_SPACING_TYPES;
    });

    const minValue = computed(() => props.min);
    const maxValue = computed(() => props.max);
    const stepValue = computed(() => props.step);

    // Инициализация данных из modelValue
    const initializeSpacingData = () => {
      const initialData = {};

      allBreakpoints.value.forEach(bp => {
        initialData[bp.name] = {};
        availableSpacingTypes.value.forEach(spacingType => {
          // Если есть значение в modelValue, используем его, иначе 0
          const existingValue = props.modelValue?.[bp.name]?.[spacingType];
          initialData[bp.name][spacingType] = existingValue !== undefined ? existingValue : 0;
        });
      });

      spacingData.value = initialData;
    };

    // Получить ID поля
    const getFieldId = (spacingType) => {
      return `${props.fieldName}-${spacingType}-${currentBreakpoint.value}`;
    };

    // Получить подпись для типа отступа
    const getSpacingLabel = (spacingType) => {
      const labels = {
        'padding-top': 'Внутренний верх',
        'padding-bottom': 'Внутренний низ',
        'margin-top': 'Внешний верх',
        'margin-bottom': 'Внешний низ'
      };
      return labels[spacingType] || spacingType;
    };

    // Получить значение отступа для текущего брекпоинта
    const getSpacingValue = (spacingType) => {
      return spacingData.value?.[currentBreakpoint.value]?.[spacingType] || 0;
    };

    // Обработать изменение слайдера
    const handleSpacingChange = (spacingType, event) => {
      const value = parseInt(event.target.value, 10);
      updateSpacingValue(spacingType, value);
    };

    // Обработать изменение числового инпута
    const handleValueInputChange = (spacingType, event) => {
      let value = parseInt(event.target.value, 10);

      // Валидация границ
      if (isNaN(value)) value = 0;
      if (value < minValue.value) value = minValue.value;
      if (value > maxValue.value) value = maxValue.value;

      updateSpacingValue(spacingType, value);
    };

    // Обновить значение отступа
    const updateSpacingValue = (spacingType, value) => {
      if (!spacingData.value[currentBreakpoint.value]) {
        spacingData.value[currentBreakpoint.value] = {};
      }

      spacingData.value[currentBreakpoint.value][spacingType] = value;
      emit('update:modelValue', spacingData.value);
    };

    // Получить ширину заполнения трека (в процентах)
    const getTrackFillWidth = (spacingType) => {
      const value = getSpacingValue(spacingType);
      const percentage = ((value - minValue.value) / (maxValue.value - minValue.value)) * 100;
      return `${percentage}%`;
    };

    // Получить превью CSS переменных
    const getCSSVariablesPreview = () => {
      const lines = [];
      
      allBreakpoints.value.forEach(bp => {
        const bpData = spacingData.value[bp.name] || {};
        const hasValues = Object.values(bpData).some(v => v > 0);
        
        if (!hasValues) return;

        if (bp.maxWidth) {
          lines.push(`@media (max-width: ${bp.maxWidth}px) {`);
        }

        availableSpacingTypes.value.forEach(spacingType => {
          const value = bpData[spacingType];
          if (value > 0) {
            const varName = `--${props.fieldName}-${spacingType}`;
            const line = bp.maxWidth ? `  ${varName}: ${value}px;` : `${varName}: ${value}px;`;
            lines.push(line);
          }
        });

        if (bp.maxWidth) {
          lines.push('}');
        }
      });

      return lines.join('\n') || '/* Нет заданных отступов */';
    };

    // Инициализация при монтировании
    onMounted(() => {
      // Устанавливаем первый доступный брекпоинт
      if (!currentBreakpoint.value && allBreakpoints.value.length > 0) {
        currentBreakpoint.value = allBreakpoints.value[0].name;
      }
      initializeSpacingData();
    });

    // Следим за изменениями modelValue извне
    watch(() => props.modelValue, (newValue) => {
      if (newValue && Object.keys(newValue).length > 0) {
        spacingData.value = { ...newValue };
      }
    }, { deep: true });

    // Следим за изменениями брекпоинтов
    watch(allBreakpoints, (newBreakpoints) => {
      // Проверяем, существует ли текущий брекпоинт в новом списке
      const currentExists = newBreakpoints.some(bp => bp.name === currentBreakpoint.value);
      
      if (!currentExists && newBreakpoints.length > 0) {
        // Если текущего брекпоинта нет в списке, устанавливаем первый доступный
        currentBreakpoint.value = newBreakpoints[0].name;
      }
    });

    return {
      currentBreakpoint,
      spacingData,
      allBreakpoints,
      availableSpacingTypes,
      minValue,
      maxValue,
      stepValue,
      getFieldId,
      getSpacingLabel,
      getSpacingValue,
      handleSpacingChange,
      handleValueInputChange,
      getTrackFillWidth,
      getCSSVariablesPreview
    };
  }
};
</script>

<style scoped lang="scss">
/* Импорт стилей spacing-control из универсального файла */
@use '../styles/components/spacing-control.scss';
</style>

