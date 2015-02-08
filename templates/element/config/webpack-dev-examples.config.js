'use strict';

require("6to5/polyfill");
var config = require('./webpack-examples.config');

module.exports = Object.assign(config, {
  devtool: 'sourcemap',
  debug: true
});
