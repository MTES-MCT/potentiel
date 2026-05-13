import globals from 'globals';
import eslintTs from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import eslintJs from '@eslint/js';

import { potentielPluginsConfig, potentielBaseRules } from '@potentiel-config/eslint-common';

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
    ...potentielPluginsConfig,
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
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
  { rules: potentielBaseRules },
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
