import globals from 'globals';
import eslintTs from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import monorepoPlugin from 'eslint-plugin-monorepo-cop';
import eslintJs from '@eslint/js';
import unusedImports from 'eslint-plugin-unused-imports';

export default eslintTs.config(
  eslintJs.configs.recommended,
  prettierConfig,
  prettierPlugin,
  ...eslintTs.configs.recommended,
  {
    ignores: [
      '**/dist/',
      '**/.storybook',
      '**/potentiel-keycloak',
      '**/*.config.js',
      '**/scripts/*.ts',
      '**/generated',
      '**/*.d.ts',
      'packages/applications/ssr',
    ],
  },
  {
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: {
      import: importPlugin,
      'monorepo-cop': monorepoPlugin,
      'unused-imports': unusedImports,
    },
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
      '@typescript-eslint/consistent-type-exports': 'error',
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
      'unused-imports/no-unused-imports': 'error',
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
