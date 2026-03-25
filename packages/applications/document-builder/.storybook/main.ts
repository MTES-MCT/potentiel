import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-webpack5',
  staticDirs: ['../src/assets'],
  webpackFinal: (config) => {
    config.plugins?.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }),
    );

    return config;
  },
};
export default config;
