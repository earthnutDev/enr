import defaultModule, { pathJoin } from './webpack.config.js';
import CopyPlugin from 'copy-webpack-plugin';
import process from 'node:process';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/**  读取本地的数据配置  */
const mode = process.env.dev_mode || 'production';

const isProduction = mode === 'production';

/**
 * 打包为 mjs 模式
 */
export default function () {
  const defaultConfig = defaultModule();

  const config = {
    ...defaultConfig,
    // 入口
    entry: {
      layoutUtil: '/components/shared/EnLayoutContent/index.tsx',
      server: '/index.server.ts',
      client: '/index.client.ts',
    },
    // 输出
    output: {
      path: pathJoin('dist'),
      filename: `[name].mjs`,
      // 库 模式
      module: true,
      library: {
        type: 'module',
      },
      chunkFormat: 'module',
      libraryTarget: 'module',
    },
    // 排除 react 等依赖包
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'react/jsx-runtime': 'react/jsx-runtime',
      'a-element-inline-style': 'a-element-inline-style',
      xcn: 'xcn',
      'a-js-tools': 'a-js-tools',
      'a-type-of-js': 'a-type-of-js',
      'styled-components': 'styled-components',
      'components/shared/EnLayoutContent': './layoutUtil.mjs',
      '@qqi/log': '@qqi/log',
    },
    // 配置 source-map 可用
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    // 实验配置
    experiments: {
      outputModule: true,
    },
    // 打包优化
    optimization: {
      chunkIds: 'named',
      mangleExports: false,
      minimize: isProduction,
      // // 代码分割
      runtimeChunk: false, // 关闭 runtime 文件单独打包
      sideEffects: false,
      usedExports: isProduction, // 启用 tree shaking
      splitChunks: {
        chunks: 'all', // 对所有 chunk 生效（包括同步和异步）
        minSize: 20, // 最小提取体积（20KB）
        minRemainingSize: 0,
        minChunks: 2, // 至少被 2 个入口引用才提取
        cacheGroups: {
          // 提取第三方库（如 react、lodash）
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
          },
          // 提取共享组件（如 SharedComp.tsx）
          shared: {
            test: /[\\/]components[\\/]shared[\\/]/, // 匹配共享组件目录
            name: 'shared', // 输出为 dist/shared.[contenthash:8].js
            minChunks: 2, // 至少被服务端和客户端入口引用
            priority: -20,
          },
        },
      },
    },
    // runtimeChunk: {
    //   name: 'runtime', // 单独提取 runtime 代码（避免重复）
    // },
  };

  delete config.devServer; // 移除测试服务
  // 移除测试用的 html 插件
  config.plugins.splice(1, 1);
  // 添加文件复制
  defaultConfig.plugins.push(
    // 妈蛋，测试环境不需要你你捣乱，正式环境需要你你不干
    // new AddUserClientPlugin(),
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

    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   openAnalyzer: false, // 自动打包浏览器
    //   reportFilename: 'bundle-report.html', // 输出报告名
    // }),
  );

  return config;
}
