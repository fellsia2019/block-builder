import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'block-builder/vue': path.resolve(__dirname, '../../src/vue.ts'),
      'block-builder': path.resolve(__dirname, '../../dist/index.esm.js')
    }
  },
  publicDir: path.resolve(__dirname, '../static'),
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['block-builder']
  }
})

