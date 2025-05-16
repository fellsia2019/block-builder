import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs', // Для Webpack 3+/Gulp
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm', // Для современных сборок
    },
  ],
  plugins: [
    nodeResolve(), // Для поддержки node_modules
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};