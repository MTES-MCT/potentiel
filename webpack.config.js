const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const _ = require('lodash')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const pageDir = path.join(__dirname, 'src', 'views', 'pages')

const pages = []

function getPageEntries(dir) {
  return fs.readdirSync(dir).forEach((file) => {
    const absoluteFilePath = path.join(dir, file)

    if (fs.statSync(absoluteFilePath).isDirectory()) {
      return getPageEntries(absoluteFilePath)
    }

    if (file.endsWith('Page.tsx') || file.endsWith('Page')) {
      pages.push(file)
    }

    return null
  })
}

getPageEntries(pageDir)

const pageEntries = pages
  .map((name) => {
    if (name.endsWith('.tsx')) {
      return { name: path.basename(name, 'Page.tsx'), path: path.join(pageDir, name) }
    }

    return {
      name: path.basename(name, 'Page'),
      path: path.join(
        pageDir,
        name,
        _.startCase(path.basename(name, 'Page')).replace(/ /g, '') + '.tsx'
      ),
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
