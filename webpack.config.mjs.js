import defaultModule, { pathJoin } from './webpack.config.cjs.js';
import CopyPlugin from 'copy-webpack-plugin';

/**
 * 打包为 mjs 模式
 */
export default function () {
  const defaultConfig = defaultModule();

  defaultConfig.plugins.splice(
    defaultConfig.plugins.length - 1,
    0,
    new CopyPlugin({
      patterns: [
        // 写入 scss
        {
          from: `src/css/`,
          to: `styles/`,
        },
        {
          from: 'README.md',
          to: 'README.md',
        },
        {
          from: 'LICENSE',
          to: '',
        },
      ],
    }),
  );

  return {
    ...defaultConfig,
    // 入口
    entry: {
      index: {
        import: './index.ts',
        filename: `index.mjs`,
      },
    },
    // 输出
    output: {
      path: pathJoin('dist'),
      filename: `[name]/index.mjs`,
      // 库 模式
      module: true,
      library: {
        type: 'module',
      },
      // chunkFormat: 'module',
      // environment: {
      //   module: true,
      // },
      // libraryTarget: 'module',
    },
    // 打包配自
    //
    // externalsType: 'module',
    // 实验配置
    experiments: {
      outputModule: true,
    },
    // optimization: {
    //   ...defaultConfig.optimization,
    //   splitChunks: {
    //     chunks: 'all',
    //     cacheGroups: {
    //       shared: {
    //         name: 'shared', // 公共包名
    //         minChunks: 2, // 两次引用才提取
    //         enforce: true, // 强制提取
    //       },
    //     },
    //   },
    // },
  };
}
