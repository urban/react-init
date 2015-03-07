import fs from 'fs';
import { join, resolve } from 'path';
import webpack  from 'webpack';
import pkg from './package.json';

const BUILD_DIR = 'build';

export default {

  devtool: 'eval',

  entry: entriesArray(),

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: join(__dirname,  BUILD_DIR),
    publicPath: '/' + BUILD_DIR + '/'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader?experimental&loose=all&optional=runtime']
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react': join(__dirname, 'node_modules', 'react'),
      '{{name}}': '../../lib/{{element}}'
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]
};

function entriesArray() {
  return fs.readdirSync(__dirname).reduce(entriesSum, {});
}

function entriesSum(entries, dir) {
  var isBuildDir = dir === BUILD_DIR;
  var isNodeModulesDir = dir === 'node_modules';
  if (!isBuildDir && !isNodeModulesDir && isDirectory(dir)) {
    entries[dir] = [
      'webpack-dev-server/client?http://0.0.0.0:3000',
      'webpack/hot/only-dev-server',
      resolve(join(dir, 'index.jsx'))
    ];
  }
  return entries;
}

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

