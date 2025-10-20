<template>
  <div 
    :style="{ 
      textAlign: textAlign, 
      fontSize: fontSize + 'px', 
      color: color,
      padding: '10px',
      border: '1px solid #e9ecef',
      borderRadius: '4px',
      background: '#f8f9fa'
    }"
    class="text-block"
  >
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'TextBlock',
  props: {
    content: {
      type: String,
      required: true
    },
    fontSize: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: '#333333'
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  }
}
</script>

<style scoped>
.text-block {
  transition: all 0.2s ease;
}

.text-block:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
