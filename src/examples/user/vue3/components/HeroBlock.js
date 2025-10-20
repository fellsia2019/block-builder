const Vue = window.Vue;

export default Vue.defineComponent({
  name: 'HeroBlock',
  props: {
    title: { type: String, default: 'Добро пожаловать' },
    subtitle: { type: String, default: 'Создайте что-то удивительное' },
    backgroundColor: { type: String, default: '#667eea' },
    accentColor: { type: String, default: '#764ba2' },
    textColor: { type: String, default: '#ffffff' },
    titleSize: { type: Number, default: 48 },
    subtitleSize: { type: Number, default: 20 },
    showButton: { type: Boolean, default: true },
    buttonText: { type: String, default: 'Начать' },
    buttonColor: { type: String, default: '#ffffff' },
    buttonTextColor: { type: String, default: '#333333' },
    showDecorations: { type: Boolean, default: true }
  },
  setup() {
    const buttonHover = Vue.ref(false);
    const handleButtonClick = () => { console.log('Hero button clicked!'); };
    Vue.onMounted(() => { console.log('Hero component mounted'); });
    return { buttonHover, handleButtonClick };
  },
  template: `
    <section class="hero-section" :style="{ background: 'linear-gradient(135deg, ' + backgroundColor + ' 0%, ' + accentColor + ' 100%)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: textColor, padding: '60px 20px', position: 'relative', overflow: 'hidden' }">
      <div class="hero-content" style="max-width: 800px; z-index: 2; position: relative;">
        <h1 :style="{ fontSize: titleSize + 'px', fontWeight: '700', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }" v-if="title">{{ title }}</h1>
        <p :style="{ fontSize: subtitleSize + 'px', marginBottom: '30px', opacity: '0.9', lineHeight: '1.6' }" v-if="subtitle">{{ subtitle }}</p>
        <div v-if="showButton" style="margin-top: 30px;">
          <button :style="{ backgroundColor: buttonColor, color: buttonTextColor, border: 'none', padding: '12px 30px', borderRadius: '25px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: buttonHover ? '0 6px 20px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.2)', transform: buttonHover ? 'translateY(-2px)' : 'translateY(0)' }" @click="handleButtonClick" @mouseenter="buttonHover = true" @mouseleave="buttonHover = false">{{ buttonText }}</button>
        </div>
      </div>
      <div v-if="showDecorations" class="hero-decorations" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1;">
        <div v-for="i in 5" :key="i" :style="{ position: 'absolute', width: Math.random() * 100 + 50 + 'px', height: Math.random() * 100 + 50 + 'px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animation: 'float ' + (3 + Math.random() * 2) + 's ease-in-out infinite' }"></div>
      </div>
    </section>
  `
});


