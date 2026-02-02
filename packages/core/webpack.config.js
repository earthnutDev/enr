/**************************************
 *
 * 本文件用于默认的加载
 *
 * TODO：之前使用的是 webpack 热开发，现在改成使用 next 渲染
 *       考虑在未来可能移除该文件
 *
 **************************************/
import webpack from 'webpack';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import process from 'node:process';
import { isArray } from 'a-type-of-js';

/**************************************
 * 请注意，打印狗在多处被设置
 **************************************/
/**  本文件路径  */
const __dirname = import.meta.dirname;

/**
 *  相对于执行目录的文件路径
 * @param str
 */
export const pathJoin = str => path.join(__dirname, str);

/**  读取本地的数据配置  */
const mode = process.env.dev_mode ?? 'production';

const isProduction = mode === 'production';

/**  生产包打包为 cjs 、mjs  */
export default function () {
  /** 入口 */
  /**
   * 开发时
   * 不考虑按需导入分包
   */
  const entry = {
    index: {
      import: ['./src/root.tsx'],
      filename: 'index.js',
    },
  };
  /**
   * 出口
   */
  const output = {
    path: pathJoin('.static'),
    charset: true,
    compareBeforeEmit: true,
    clean: true,
    publicPath: '/',
  };

  /** 模块解析方式 */
  const resolve = {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.scss'],
    alias: {
      src: pathJoin('src/'), /// src  主要代码
      components: pathJoin('components/'), /// 公共组件
      customHooks: pathJoin('customHooks/'), // 公共自定义 hooks
      dog: pathJoin('./dog.ts'),
      page: pathJoin('src/page/'), /// 页面相关
      css: pathJoin('src/css/'), /// 公共 css 相关
      storage: pathJoin('storage'), // 公共的 storage
      utilities: pathJoin('utilities'), // 公共的其他数据
    },
  };

  const externals = {};

  /** 模块配置 */
  const module = {
    rules: [
      // 配置 ts loader
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: [
          ...customLoader((isProduction && 'remove-import-dog') || undefined),
          {
            loader: 'babel-loader',
            options: {
              configFile: pathJoin('./babel.config.custom.js'),
            },
          },
          ...customLoader(
            'add-react-import-loader', // 'add-use-client-loader'
          ),
        ],
      },
      // 配置 scss
      {
        test: /\.s?css$/,
        // 加载是至下而上，也就是说 webpack 使用数组是 pop
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // options: {
            //   modules: true,
            // },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // 配置 文件
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/,
        type: 'asset/inline',
        // type: 'asset/resource',
        // generator: {
        //   filename: '[name].[hash:8][ext]',
        //   outputPath: 'asset/images',
        //   publicPath: '../asset/images/',
        // },
      },
    ],
  };

  /** 插件 */
  const plugins = [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    /** 调试面板页面 */
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body',
      templateParameters: {
        title: '测试',
      },
    }),
  ];

  /** 优化配置 */
  const optimization = {
    splitChunks: {
      minSize: 50000, /// 拆分前模块的最小储存占用，大于该值才会拆分
      minChunks: 2, /// 模块被引用的最小次数
      maxAsyncRequests: 4, /// 最多同时发起 4 个异步请求来加载拆分后的 chunk
      cacheGroups: {
        /// npm 下所有模块
        defaultVendors: {
          test: /[\\/]node_modules[\\/](?!a-js-tools|pako|a-element-inline-style|a-type-of-js)/,
          name: 'commons',
          chunks: 'initial',
          priority: -10,
          // enforce: true,
        },
      },
    },
  };

  /**
   * 开发服务
   */
  const devServer = {
    historyApiFallback: {
      enabled: true,
      rewrites: [{ from: /.*/, to: 'index.html' }],
      trailingSlash: false, // 禁止尾随 /
    },
    static: {
      directory: pathJoin('public'),
    },
    compress: true, // gzip 压缩
    hot: true,
    host: '0.0.0.0',
    port: 6674,
    open: true,
  };

  /**
   *
   */
  const config = {
    entry,
    output,
    resolve,
    module,
    plugins,
    optimization,
    mode,
    externals,
    devtool: 'source-map',
    devServer,
  };

  return config;
}

/**
 *  自定义 loader
 * @param arg
 */
function customLoader(...arg) {
  return arg
    .filter(Boolean)
    .reduce(
      (result, currentValue) =>
        (isArray(currentValue) && result.concat(currentValue)) || [...result, currentValue],
      [],
    )
    .map(e => pathJoin(`./loaders/${e}.js`));
}
