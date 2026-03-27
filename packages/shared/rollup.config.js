// 使用更可控的 rollup-plugin-typescript2 代替官插 @rollup/plugin-typescript
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import { external } from '@qqi/rollup-external';
import { preserveDirective } from '@qqi/rollup-preserve-directive';

const isProduction = globalThis?.process?.env?.NODE_ENV === 'production';
// [https://cn.rollupjs.org/configuration-options/]

export default {
  input: [
    './src/index.ts',
    isProduction ? './src/log-production.ts' : './src/log-development.ts',
  ],
  output: ['es', 'cjs'].map(e => ({
    format: e, // 打包模式
    entryFileNames: '[name].js', // 打包文件名
    preserveModules: !isProduction, // 保留独立模块结构（关键）
    // preserveModulesRoot: 'src', // 保持 src 目录结构
    sourcemap: false, // 正式环境：关闭 source map
    // chunkFileNames: '[name]-[hash].js',
    // manualChunks(id) {
    //   console.log(id);
    //   return null;
    // },
    exports: 'named', // 导出模式
    dir: `dist/${e}/`,
  })),
  // 配置需要排除或包含的包
  external: external({
    ignore: ['node:', 'a-type-of-js', 'a-js-tools'],
    include: isProduction
      ? ['@qqi/log', '@color-pen/static', 'color-pen']
      : ['@qqi/log', '@color-pen/static', 'color-pen'],
  }),
  plugins: [
    preserveDirective(),
    resolve(),
    commonjs(),
    json(),
    typescript({
      clean: true,
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        noEmit: true, // 仅允许生成类型文件
        declaration: true,
        emitDeclarationOnly: true,
        importHelpers: false, // 确保不引入 tslib
      },
    }),
    cleanup(),
  ],
};
