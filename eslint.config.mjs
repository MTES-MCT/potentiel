import eslintJs from '@eslint/js';
import globals from 'globals';
import eslintTs from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import next from '@next/eslint-plugin-next';

/**
 * @type {import("eslint").Linter.FlatConfig}
 */
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
    plugins: { import: importPlugin },
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
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
          ],
        },
      ],
    },
  },
  {
    files: ['**/applications/ssr/src/**/*.ts'],
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      '@next/next/no-html-link-for-pages': 'off',
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
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
