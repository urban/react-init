'use strict';

var config = require('./webpack-examples.config');

Object.assign = require('object-assign');

module.exports = Object.assign(config, {
  devtool: 'sourcemap',
  debug: true
});
