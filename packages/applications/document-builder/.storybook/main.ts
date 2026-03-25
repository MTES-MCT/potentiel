import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineMain } from '@storybook/react-vite/node';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
    config.plugins ??= [];
    config.plugins.push(nodePolyfills());
    return config;
  },
});
