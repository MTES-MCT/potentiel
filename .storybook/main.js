const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: 'storybook-addon-turbo-build',
      options: {
        optimizationLevel: 3,
      },
    },
    '@storybook/addon-mdx-gfm',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  staticDirs: ['../src/public'],

  webpackFinal: async (config) => {
    return {
      ...config,
      plugins: [...config.plugins, new NodePolyfillPlugin()],
    };
  },

  docs: {
    autodocs: true,
  },
};
