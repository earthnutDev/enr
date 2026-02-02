import defaultModule, { pathJoin } from './webpack.config.js';

/**
 * 打包为 js 模式
 */
export default function () {
  const defaultConfig = defaultModule();
  const config = {
    ...defaultConfig,
    entry: /** umd 格式 */ {
      index: {
        import: ['./index.umd.ts'],
        filename: `index.js`,
      },
    },
    output: /** umd 格式 打包 */ {
      filename: 'index.js',
      path: pathJoin('dist'),
      library: 'enr',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    mode: 'production',
    target: 'web',
    optimization: {
      minimize: true, // 生产模式默认为 true
      usedExports: true, // 启用 tree shaking
      sideEffects: true, /// 告诉 webpack 这个库没有副作用，以便有效的 tree shaking
    },
  };

  delete config.devServer;
  delete config.devtool;
  config.plugins.splice(1, 1);

  return config;
}
