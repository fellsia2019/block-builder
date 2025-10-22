<template>
  <section class="hero-section" :style="sectionStyle">
    <div class="hero-content">
      <h1 v-if="title" :style="titleStyle">{{ title }}</h1>
      <p v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</p>
      <div v-if="showButton" class="button-wrapper">
        <button 
          class="hero-button"
          :style="buttonStyle"
          @click="handleButtonClick"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
    
    <div v-if="showDecorations" class="hero-decorations">
      <div 
        v-for="i in 5" 
        :key="i" 
        class="decoration"
        :style="getDecorationStyle(i)"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
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
})

const sectionStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.backgroundColor} 0%, ${props.accentColor} 100%)`,
  minHeight: '400px',
  color: props.textColor
}))

const titleStyle = computed(() => ({
  fontSize: `${props.titleSize}px`,
  fontWeight: '700',
  marginBottom: '20px',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
}))

const subtitleStyle = computed(() => ({
  fontSize: `${props.subtitleSize}px`,
  marginBottom: '30px',
  opacity: '0.9',
  lineHeight: '1.6'
}))

const buttonStyle = computed(() => ({
  backgroundColor: props.buttonColor,
  color: props.buttonTextColor,
  border: 'none',
  padding: '12px 30px',
  borderRadius: '25px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer'
}))

const getDecorationStyle = (index) => ({
  width: `${Math.random() * 100 + 50}px`,
  height: `${Math.random() * 100 + 50}px`,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  animationDuration: `${3 + Math.random() * 2}s`,
  animationDelay: `${index * 0.2}s`
})

const handleButtonClick = () => {
  console.log('Hero button clicked!')
}

onMounted(() => {
  console.log('Hero component mounted')
})
</script>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  z-index: 2;
  position: relative;
}

.button-wrapper {
  margin-top: 30px;
}

.hero-button {
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.hero-button:active {
  transform: translateY(0);
}

.hero-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.decoration {
  position: absolute;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}
</style>

