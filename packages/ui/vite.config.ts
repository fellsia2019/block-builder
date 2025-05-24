import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BlockBuilderUI',
      formats: ['es', 'cjs'],
      fileName: 'block-builder-ui'
    },
    rollupOptions: {
      external: ['@block-builder/core'],
      output: {
        globals: {
          '@block-builder/core': 'BlockBuilderCore'
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "./styles/variables.scss";`
      }
    }
  }
});