'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = [
  makeConfig(false),
  makeConfig(true)
];

function makeConfig(isProduction) {

  var filename = isProduction? '{{name}}.min.js' : '{{name}}.js';
  var plugins = [];

  if (isProduction) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    );
  }

  return require('./make-webpack-config')({

    entry: path.resolve(__dirname, '../lib/index.jsx'),

    output: {
      filename: filename,
      path: path.resolve(__dirname, '../dist'),
      libraryTarget: 'umd',
      library: '{{element}}'
    },

    externals: {
      'react': 'React'
    },

    plugins: plugins

  });
}
