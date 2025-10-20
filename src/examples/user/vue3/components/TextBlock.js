const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'TextBlock',
  props: {
    content: { type: String, required: true },
    fontSize: { type: Number, default: 16 },
    color: { type: String, default: '#333333' },
    textAlign: { type: String, default: 'left' }
  },
  template: `
    <div 
      :style="{ textAlign: textAlign, fontSize: fontSize + 'px', color: color, padding: '10px', border: '1px solid #e9ecef', borderRadius: '4px', background: '#f8f9fa' }"
      class="text-block"
    >
      {{ content }}
    </div>
  `
});


