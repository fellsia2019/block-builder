const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');
const dts = require('rollup-plugin-dts').default;
const postcss = require('rollup-plugin-postcss');
const postcssImport = require('postcss-import');

const packageJson = require('./package.json');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      // Обработка CSS/SCSS - инлайним в JS
      postcss({
        extensions: ['.css', '.scss'],
        inject: false, // Не инъектировать автоматически
        extract: false, // Встраиваем в JS, не создаем отдельный файл
        minimize: true,
        modules: false,
        use: {
          sass: {
            api: 'modern-compiler', // Используем современный API
            silenceDeprecations: ['legacy-js-api'],
          }
        },
        plugins: [postcssImport()], // Обработка @import директив
      }),
      resolve({
        browser: true,
        extensions: ['.js', '.ts', '.css', '.scss'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true, // Генерируем .d.ts файлы
        declarationDir: './dist',
        declarationMap: true,
      }),
      terser(),
    ],
    external: ['vue'],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/, /\.scss$/],
  },
];
