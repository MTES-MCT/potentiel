const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

const pageDir = path.join(__dirname, 'src', 'views', 'pages2')

const pageEntries = fs.readdirSync(pageDir)
                .filter(name => name.endsWith('Page.tsx') || name.endsWith('Page'))
                .map(name => {
                  if(name.endsWith('.tsx')){
                    return { name: path.basename(name, 'Page.tsx'), path: path.join(pageDir, name) }
                  }
                  else{
                    return { name: path.basename(name, 'Page'), path: path.join(pageDir, name, 'index.tsx') }
                  }
                })
                .reduce((entries, { name, path }) => ({
                  ...entries,
                  [name]: {
                    import: path,
                    dependOn: 'shared'
                  }
                }), {})

module.exports = {
  mode: 'development', // TODO: use NODE_ENV
  entry: {
    ...pageEntries,
    shared: ['react', 'react-dom']
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.npm_package_version': JSON.stringify(process.env.npm_package_version),
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        exclude: '/node_modules/',
        options: {
          loader: 'tsx',
          target: 'es2015'
        }
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'src', 'public', 'js'),
  },
}
