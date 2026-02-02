import process from 'node:process';

/**
 * ##   babel 配置文件
 * @param api
 */
export default function (api) {
  api.cache(true);
  /**  读取本地的数据配置  */
  const env = process.env.dev_mode ?? 'production';
  /**  是否为生产环境  */
  const isProduction = env === 'production';

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not dead'],
          },
          bugfixes: true, // 重要：修复现代语法转换问题
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic', // 关键词：启动自动运行时
          importSource: 'react', // 指定导入源
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      isProduction && '@qqi/babel-plugin-remove-dog-calls',
      isProduction && ['transform-remove-console', { exclude: ['error', 'warn'] }],
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      ['@babel/plugin-proposal-private-methods', { loose: false }],
      [
        '@babel/plugin-proposal-private-property-in-object',
        {
          loose: false,
        },
      ],
      // 运行时
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
          helpers: true,
          useESModules: true,
          absoluteRuntime: true,
          version: '^7.23.0',
          // absoluteRuntime: false,
        },
      ],
      // styled-components 库打包转义
      [
        'styled-components',
        {
          ssr: true,
          displayName: true,
        },
      ],
    ].filter(Boolean),
    env: {
      production: {
        plugins: [
          ['@babel/plugin-transform-react-constant-elements'],
          [['@babel/plugin-transform-react-inline-elements']],
        ],
      },
    },
  };
}
