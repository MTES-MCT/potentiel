import globals from 'globals';
import eslintTs from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import monorepoPlugin from 'eslint-plugin-monorepo-cop';
import react from 'eslint-plugin-react';
import eslintJs from '@eslint/js';
import next from '@next/eslint-plugin-next';

export default eslintTs.config(
  eslintJs.configs.recommended,
  prettierConfig,
  prettierPlugin,
  ...eslintTs.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    ignores: [
      '**/dist/',
      '**/legacy/',
      '**/.storybook',
      '**/.next',
      '**/potentiel-keycloak',
      '**/*.config.js',
    ],
  },
  {
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { import: importPlugin, 'monorepo-cop': monorepoPlugin },
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
    },
  },

  {
    files: ['**/*.ts'],
    ignores: [
      '.github/**/*',
      '**/*.test*.ts',
      '**/*.integration.ts',
      '**/*.spec*.ts',
      'packages/infrastructure/ds-api-client/codegen.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'object-shorthand': 'error',
    },
  },

  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-case-declarations': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'monorepo-cop/no-relative-import-outside-package': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@potentiel*/**/src/*'], message: 'Use exposed properties' },
            {
              group: ['*dist*'],
              message: 'Do not import from dist; import from source files',
            },
          ],
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: ['builtin', 'external', 'internal', 'parent', 'index'],
          pathGroups: [
            {
              pattern: '@potentiel*/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'parent',
              position: 'before',
            },
            {
              pattern: '#**',
              group: 'parent',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/applications/ssr/src/**/*.{ts,tsx}'],
    extends: eslintTs.configs.recommended,
    plugins: {
      ...react.configs.flat.recommended.plugins,
      '@next/next': next,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...next.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/ban-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 2,
    },
  },
  // support for chai
  {
    files: ['**/specifications/src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  // allow "any" in tests
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.integration.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // because of chai assertion style
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
);
