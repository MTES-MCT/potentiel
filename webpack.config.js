const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const pageEntries = glob
  .sync('./src/views/**/*@(Page|Page.tsx)')
  .map((filePath) => {
    if (filePath.endsWith('.tsx')) {
      return { name: path.basename(filePath, 'Page.tsx'), path: filePath }
    } else {
      return {
        name: path.basename(filePath, 'Page'),
        path: path.join(filePath, 'index.ts'),
      }
    }
  })
  .reduce(
    (entries, { name, path }) => ({
      ...entries,
      [name]: {
        import: path,
        dependOn: 'shared',
      },
    }),
    {}
  )

module.exports = {
  mode:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
      ? 'production'
      : 'development',
  entry: {
    ...pageEntries,
    shared: ['react', 'react-dom', 'moment', 'moment-timezone'],
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
    fallback: { path: require.resolve('path-browserify') },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        exclude: '/node_modules/',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src', 'public', 'js'),
  },
}
