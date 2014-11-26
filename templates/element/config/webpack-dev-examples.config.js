'use strict';

var examplesConfig = require('./webpack-examples.config');

Object.assign = require('object-assign');

module.exports = Object.assign(examplesConfig, {
  devtool: 'sourcemap',
  debug: true
});
