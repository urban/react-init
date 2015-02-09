'use strict';

var test = require('tape');
require("6to5/register");
// es6 modules
var someModule = require('../lib/index');

test('args', function (t) {
  t.plan(1);

  t.ok(true, "this is always true");
});
