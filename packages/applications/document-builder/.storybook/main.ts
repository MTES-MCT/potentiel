import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-swc',
  ],
  framework: '@storybook/react-webpack5',
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
