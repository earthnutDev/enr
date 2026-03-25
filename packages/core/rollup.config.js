import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
// import typescript from '@rollup/plugin-typescript';
// 使用更可控的 rollup-plugin-typescript2 代替官插 @rollup/plugin-typescript
import typescript from 'rollup-plugin-typescript2';
// import cleanup from 'rollup-plugin-cleanup';
import { external } from '@qqi/rollup-external';
import copy from 'rollup-plugin-copy';
import url from '@rollup/plugin-url';
// import image from 'rollup-plugin-image';
import { _p } from 'a-node-tools';
import { cyanPen, redPen } from 'color-pen';
import { preserveDirective } from '@qqi/rollup-preserve-directive';

// console.log(globalThis?.process?.env); // 环境

const isProduct = globalThis?.process?.env?.NODE_ENV === 'production';

_p(`当前执行环境为 ${isProduct ? cyanPen`生产环境` : redPen`开发环境`}`);

// [https://rollupjs.org/configuration-options/]
export default {
  input: {
    index: './src/index.ts', // 默认：聚合导出入口
  },
  output: ['es', 'cjs'].map(e => ({
    format: e, // ESM 模式
    entryFileNames: `[name].${e}.js`, // 打包文件名
    preserveModules: true, // 保留独立模块结构（关键）
    preserveModulesRoot: 'src', // 保持 src 目录结构
    sourcemap: false, // 正式环境：关闭 source map
    exports: 'named', // 导出模式
    dir: `dist/`,
  })),
  // 配置需要排除的包
  external: external({
    ignore: ['node:'],
    exclude: [],
    include: ['zza/log', 'zza'],
  }),
  plugins: [
    preserveDirective(),
    url({
      // 将小于 8 kb 的文件内联为 base64 编码
      limit: 8 * 1024, // 8 kb
      include: ['**/*.png'], // 只处理 png 文件
      emitFiles: true, // 发出文件而不是将其转化为 base6
      fileName: '[name][hash].[ext]', // 输出的格式
    }),
    // 先使用 TypeScript 检测类型和生成文件
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        noEmit: true, // 仅允许生成类型文件
        declaration: true,
        emitDeclarationOnly: true,
        importHelpers: false, // 确保不引入 tslib
      },
      clean: true,
    }),
    babel({
      extends: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'runtime', // 关键： 使用 @babel/runtime
      include: ['src/**/*'], // 确保包含所有的源文件
      exclude: 'node_modules/**',
      skipPreflightCheck: true,
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    }),
    resolve({
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    }),
    commonjs(),
    json(),
    // 去除无用代码
    // cleanup(),
    copy({
      targets: [
        { src: 'src/css/**', dest: 'dist/styles/' },
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
  ],
};
