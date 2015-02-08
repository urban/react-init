'use strict';

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var EXAMPLES_DIR = path.resolve(__dirname, '../examples');
var BUILD_DIR = 'build';

module.exports = {

  entry: entriesArray(),

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(EXAMPLES_DIR,  BUILD_DIR),
    publicPath: '/' + BUILD_DIR + '/'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: '6to5-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
      }
    ]
  },

  resolveLoader: {
    root: path.join(__dirname, '../node_modules')
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
    alias: {
      '{{name}}': '../../lib/index'
    }
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]
};

function entriesArray() {
  return fs.readdirSync(EXAMPLES_DIR).reduce(entriesSum, {});
}

function entriesSum(entries, dir) {
  var isBuildDir = dir === BUILD_DIR;

  if (!isBuildDir && isDirectory(path.join(EXAMPLES_DIR, dir))) {
    entries[dir] = path.join(EXAMPLES_DIR, dir, 'index.jsx');
  }
  return entries;
}

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}
