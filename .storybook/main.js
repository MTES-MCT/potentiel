const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  stories: ['../src/views/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  staticDirs: ['../src/public'],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        plugins: [new TsconfigPathsPlugin()],
      },
      plugins: [...config.plugins, new NodePolyfillPlugin()],
    }
  },
}
