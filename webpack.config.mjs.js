import defaultModule, { pathJoin } from './webpack.config.js';
import CopyPlugin from 'copy-webpack-plugin';

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
      'a-element-inline-style': 'a-element-inline-style',
      xcn: 'xcn',
      'a-js-tools': 'a-js-tools',
      'a-type-of-js': 'a-type-of-js',
      'styled-components': 'styled-components',
      'components/shared/EnLayoutContent': './layoutUtil.mjs',
    },
    // 打包模式
    mode: 'production',
    // 配置 source-map 可用
    devtool: 'source-map',
    // 实验配置
    experiments: {
      outputModule: true,
    },
    // 打包优化
    optimization: {
      splitChunks: {
        chunks: 'all', // 对所有 chunk 生效（包括同步和异步）
        minSize: 1, // 最小提取体积（20KB）
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
  ///  在正式环境添加自定义的 dog 进行不执行打印
  config.resolve.alias['@qqi/log'] = pathJoin('./mocks/log.ts');

  return config;
}
