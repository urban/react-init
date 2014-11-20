'use strict';

var path = require('path');

Object.assign = require('object-assign');

module.exports = function (options) {

  var externals = [];
  if (options.externals) {
    externals = externals.concat(options.externals);
  }

  var alias = {}
  if (options.alias) {
    Object.assign(alias, options.alias);
  }

  var plugins = [];
  if (options.plugins) {
    plugins = plugins.concat(options.plugins);
  }

  return {
    entry: options.entry,
    output: options.output,
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'jsx-loader?harmony'
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
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, '../node_modules')
    },
    externals: externals,
    resolve: {
      extensions: ['', '.js', '.jsx', '.css'],
      alias: alias
    },
    plugins: plugins
  };
};
