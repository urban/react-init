'use strict';

var test = require('tape');
require("babel/register");
// es6 modules
var someModule = require('../lib/index');

test('args', function (t) {
  t.plan(1);

  t.ok(true, "this is always true");
});
