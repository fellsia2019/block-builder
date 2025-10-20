const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'ButtonBlock',
  props: {
    text: { type: String, required: true },
    backgroundColor: { type: String, default: '#007bff' },
    color: { type: String, default: '#ffffff' },
    borderRadius: { type: Number, default: 4 },
    padding: { type: String, default: '8px 16px' }
  },
  data() {
    return { isLoading: false };
  },
  methods: {
    handleClick() {
      this.isLoading = true;
      console.log('Кнопка нажата:', this.text);
      setTimeout(() => { this.isLoading = false; }, 1000);
    },
    handleMouseEnter() {
      this.$el.querySelector('.custom-button').style.transform = 'scale(1.05)';
    },
    handleMouseLeave() {
      this.$el.querySelector('.custom-button').style.transform = 'scale(1)';
    }
  },
  template: `
    <div class="button-block" style="text-align: center; margin: 20px 0;">
      <button 
        :style="{ backgroundColor: backgroundColor, color: color, borderRadius: borderRadius + 'px', padding: padding, border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '16px', fontWeight: '500' }"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :disabled="isLoading"
        class="custom-button"
      >
        <span v-if="!isLoading">{{ text }}</span>
        <span v-else>Загрузка...</span>
      </button>
    </div>
  `
});


