'use strict';

require("babel/polyfill");
var config = require('./webpack-examples.config');

module.exports = Object.assign(config, {
  devtool: 'sourcemap',
  debug: true
});
