import type { StorybookConfig } from '@storybook/nextjs';

import path, { dirname, join } from 'path';
import webpack from 'webpack';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  features: {
    experimentalRSC: true,
  },

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-themes'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve || {}).fallback,
        async_hooks: false,
        inspector: false,
        child_process: false,
        net: false,
        tls: false,
        dns: false,
      },
    };

    if (config.module?.rules) {
      config.module.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      });
    }

    if (config.plugins) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /src\/utils\/withUtilisateur/,
          path.join(__dirname, 'mockedWithUtilisateur.js'),
        ),
      );
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }),
      );
    }

    return config;
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
export default config;
