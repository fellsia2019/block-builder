import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'block-builder': path.resolve(__dirname, '../../dist/index.esm.js')
    }
  },
  publicDir: path.resolve(__dirname, '../static'),
  server: {
    host: 'localhost',
    port: 3002,
    strictPort: true,
    open: true
  },
  optimizeDeps: {
    exclude: ['block-builder']
  }
})

