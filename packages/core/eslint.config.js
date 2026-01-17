import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdocPlugin from 'eslint-plugin-jsdoc';

export default defineConfig([
  globalIgnores(['**/origin.js', '.next/*']),
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
  {
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      // 基础规则
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': [
        'error',
        {
          // 配置允许的标签
          definedTags: ['packageDocumentation'],
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
  },
  eslintConfigPrettier,
  {
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    rules: {
      // 禁用 "React" 必须在作用域的检测
      'react/react-in-jsx-scope': 'off',
      //
      'react/jsx-uses-react': 'off',
    },
  },
]);
