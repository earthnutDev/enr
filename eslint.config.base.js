// eslint.config.mjs（ESM 格式）
import globals from 'globals'; // 全局变量（非插件，必备）
import js from '@eslint/js'; // 必须：核心推荐规则
import tseslint from 'typescript-eslint'; // 必须：TypeScript 支持
import reactPlugin from 'eslint-plugin-react'; // 必须：React 规则
import reactHooksPlugin from 'eslint-plugin-react-hooks'; // 必须：React Hooks 规则
import importPlugin from 'eslint-plugin-import'; // 必须：导入导出规范
import prettierConfig from 'eslint-config-prettier'; // 必须：关闭 Prettier 冲突规则

// 可选插件（按需启用）
import jsdocPlugin from 'eslint-plugin-jsdoc'; // 可选：JSDoc 注释
import unusedImportsPlugin from 'eslint-plugin-unused-imports'; // 可选：删除未使用导入
import promisePlugin from 'eslint-plugin-promise'; // 可选：Promise 规范
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tsconfigPath = resolve(__dirname, 'tsconfig.json');

const ignorePattern = [
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  'lib/',
  'es/',
  '**/test/**', // 匹配任何目录下的 test 目录
  '**/*.test.ts', // 匹配任何目标下的 .test.ts 文件
  '**/*.spec.ts', // 匹配 .spec.ts 文件
  '**/*.min.js',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  '.docusaurus',
  '.wrangler',
  '.rollup.cache',
];

export default [
  // 0. 忽略文件配置
  {
    ignores: ignorePattern, // 优先配置忽略规则，提升性能
  },
  // 1. 基础配置（所有文件通用）
  js.configs.recommended, // 必须：ESLint 核心推荐规则
  {
    languageOptions: {
      globals: {
        ...globals.browser, // 浏览器全局变量
        ...globals.node, // Node.js 全局变量
        React: 'readonly', // 避免出现 `'React' is not defined.<eslint·no-undef>` 提示
        NodeJS: 'readonly',
        HTMLWebViewElement: 'readonly',
      },
    },
  },

  // 2. TypeScript 配置（必须）
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['src/**/*.{ts,tsx}', 'types.d.ts', 'scripts/**/*.{js,ts}'], // 按需配置
    languageOptions: {
      ...config.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025, // 浏览器 + Node +  ES2025 全局
      },
      // parser: tseslint.parser, // 显式指定 TS 解析器，解决接口不匹配
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        tsconfigRootDir: __dirname, // ESM 获取当前配置目录
        project: [tsconfigPath], // 类型感知
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }, // 开启JSX解析，适配React
      },
    },
    plugins: {
      ...config?.plugins,
      // 需要搭配安装 eslint-import-resolver-typescript
      import: importPlugin,
      'unused-imports': unusedImportsPlugin, // 内置未使用导入插件
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: tsconfigPath,
          alwaysTryTypes: true,
        },
        node: true, // 兜底 node 解析器，兼容 commonjs/esm 混合模块
      },
    },
    rules: {
      // 原生规则对 TS 语法支持极差，必须关闭
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true, // 禁用 在单个 import 中混合值与类型
          fixStyle: 'separate-type-imports',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'warn',
      // 未使用的导入扶着， error 强制级别删除，联动 ts-eslint 规则
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off', // 与 '@typescript-eslint/no-unused-vars' 冲突
    },
  })),

  // 3. React 配置（必须，React 项目）
  {
    files: ['**/*.{jsx,tsx,js,ts}'], // 处理 JSX/TSX 文件
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }, // 启用 JSX
    },
    settings: { react: { version: 'detect' } }, // 自动检测 React 版本
    plugins: {
      react: reactPlugin, // 必须：注册 React 插件
      'react-hooks': reactHooksPlugin, // 必须：注册 Hooks 插件
    },
    rules: {
      // React 核心规则（必须）
      'react/react-in-jsx-scope': 'off', // React 17+ 无需手动引入 React
      'react/prop-types': 'off', // 用 TS 类型代替 PropTypes
      // Hooks 规则（必须）
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // 4. 可选插件配置（按需启用）

  // 4.1 可选：JSDoc 注释规范
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: { jsdoc: jsdocPlugin },
    rules: {
      // 基础规则
      'jsdoc/check-alignment': 'error',
      'jsdoc/require-param': [
        'error',
        {
          unnamedRootBase: ['props', 'options', 'arg'],
        },
      ],
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': [
        'error',
        {
          // 配置允许的标签
          definedTags: ['packageDocumentation', 'lastModified'],
        },
      ],
      'jsdoc/check-types': 'error',

      // TypeScript 适配规则
      'jsdoc/no-types': 'error',
      'jsdoc/require-param-type': 'off', // 使用 TS 类型
      'jsdoc/require-returns-type': 'off', // 使用 TS 类型

      // 文档质量规则
      'jsdoc/require-description': [
        'error',
        {
          contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
        },
      ],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
    },
    // settings: {
    // jsdoc: {
    //   // 用于配置首选项别名设置一个 JSDoc 标签
    //     tagNamePreference: {
    //       // eg.
    //       // "param": "arg",
    //       // "returns": "return",
    //       // todo: false, // 禁用 todo
    //       // todo: "禁用原因", // 禁用 todo ，并展示友好原因
    //     },
    // },
    // },
  },

  // 4.2 可选：Promise 规范（promise）
  {
    plugins: { promise: promisePlugin },
    rules: {
      'promise/always-return': 'error', // Promise 必须返回
      'promise/no-return-wrap': 'error', // 禁止用 Promise.resolve 包裹
    },
  },

  // 5. 关闭 Prettier 冲突规则（必须，用 Prettier 时）
  prettierConfig,
];
