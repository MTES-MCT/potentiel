import importPlugin from 'eslint-plugin-import';
import monorepoPlugin from 'eslint-plugin-monorepo-cop';
import unusedImports from 'eslint-plugin-unused-imports';

export const noRestrictedImportsPatterns = [
  { group: ['@potentiel*/**/src/*'], message: 'Use exposed properties' },
  { group: ['*dist*'], message: 'Do not import from dist; import from source files' },
];

export const importOrderOptions = {
  'newlines-between': 'always',
  pathGroupsExcludedImportTypes: ['builtin'],
  groups: ['builtin', 'external', 'internal', 'parent', 'index'],
  pathGroups: [
    { pattern: '@potentiel*/**', group: 'internal', position: 'before' },
    { pattern: '@/**', group: 'parent', position: 'before' },
    { pattern: '#**', group: 'parent', position: 'before' },
  ],
};

export const potentielPluginsConfig = {
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
};

export const potentielBaseRules = {
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'no-case-declarations': 'off',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'monorepo-cop/no-relative-import-outside-package': 'error',
  'no-restricted-imports': ['error', { patterns: noRestrictedImportsPatterns }],
  'import/order': ['error', importOrderOptions],
  'unused-imports/no-unused-imports': 'error',
};
