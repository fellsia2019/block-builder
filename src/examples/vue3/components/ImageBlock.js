const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'ImageBlock',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    borderRadius: { type: Number, default: 0 }
  },
  methods: {
    handleImageError() {
      console.warn('Ошибка загрузки изображения:', this.src);
    },
    handleImageLoad() {
      console.log('Изображение загружено:', this.src);
    }
  },
  template: `
    <div class="image-block" style="text-align: center; margin: 20px 0;">
      <img 
        :src="src" 
        :alt="alt" 
        :style="{ borderRadius: borderRadius + 'px', maxWidth: '100%', height: 'auto', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }" 
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>
  `
});


