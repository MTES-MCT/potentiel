import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'dist/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/no-unescaped-entities': 'off',
      'react/jsx-props-no-spreading': "error",
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              message: 'Importer Link depuis @/components/atoms/LinkNoPrefetch',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ["**/components/**/*.tsx"],
    rules: {
      'react/jsx-props-no-spreading': 'off',
    },
  }
];

export default eslintConfig;
