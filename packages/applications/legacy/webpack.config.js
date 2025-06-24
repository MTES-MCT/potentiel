const glob = require('glob');
const startCase = require('lodash/startCase');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const formatPageEntrieName = (name) => name.charAt(0).toLowerCase() + name.slice(1);
const pageEntries = glob
  .sync('./src/views/pages/**/*@(Page|Page.tsx)')
  .map((name) => {
    if (name.endsWith('.tsx')) {
      return { name: path.basename(name, 'Page.tsx'), path: `./${name}` };
    } else {
      return {
        name: path.basename(name, 'Page'),
        path: `./${path.join(
          name,
          startCase(path.basename(name, 'Page')).replace(/ /g, '') + '.tsx',
        )}`,
      };
    }
  })
  .reduce(
    (entries, { name, path }) => ({
      ...entries,
      [formatPageEntrieName(name)]: {
        import: path,
        dependOn: 'shared',
      },
    }),
    {},
  );

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    ...pageEntries,
    shared: ['react', 'react-dom', 'moment', 'moment-timezone'],
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
    },
  },
  plugins: [new Dotenv()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        exclude: '/node_modules/',
        options: {
          target: 'es2015',
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src', 'public', 'js'),
  },
};
