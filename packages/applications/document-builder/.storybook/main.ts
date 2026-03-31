import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineMain } from '@storybook/react-vite/node';

const getAbsolutePath = (packageName: string) =>
  dirname(fileURLToPath(import.meta.resolve(join(packageName, 'package.json'))));

export default defineMain({
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  stories: ['../src/**/*.stories.tsx'],
  staticDirs: [{ from: '../src/assets', to: '/' }],
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'node:path': 'path-browserify',
          path: 'path-browserify',
        },
      },
    };
  },
});
