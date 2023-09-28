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
  ],

  framework: '@storybook/react-webpack5',

  staticDirs: [{ from: '../src/public', to: '/' }],

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
