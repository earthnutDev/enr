import TerserPlugin from 'terser-webpack-plugin';
import defaultModule, { pathJoin } from './webpack.config.js';
import AddUserClientPlugin from './scripts/add-use-client-webpack-plugin.js';
export { pathJoin };

/**
 * 打包为 mjs 模式
 */
export default function () {
  const commonConfig = defaultModule();

  const config = {
    ...commonConfig,
    entry: {
      index: {
        import: './index.ts',
        filename: 'index.cjs',
      },
    },
    output: {
      path: pathJoin('dist'),
      filename: `[name]/index.cjs`,
      libraryTarget: 'commonjs2',
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
    },
    // 打包模式
    mode: 'production',
    // 配置 source-map 可用
    devtool: false,
    // 打包配置
    optimization: {
      chunkIds: 'named',
      mangleExports: false,
      minimize: false,
      // 代码分割
      runtimeChunk: false, // 关闭 runtime 文件单独打包
      sideEffects: false,
    },
    resolve: {
      ...commonConfig.resolve,
      alias: {
        ...commonConfig.resolve.alias,
        /**  在正式环境添加自定义的 dog 进行不执行打印  */
        '@qqi/log': pathJoin('./mocks/log.ts'),
      },
    },
  };

  delete config.devServer;
  config.plugins.splice(
    1,
    // 移除测试用的 html 插件
    1,
    new AddUserClientPlugin(),
  );

  return config;
}
