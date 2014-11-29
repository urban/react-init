'use strict';

import co from 'co';
import { ask, finish, abort } from './api';
import prompt from './prompt';
import build from './build';
import readline from 'readline';
import fs from 'mz/fs';
import chalk from 'chalk';

var questions = require('../templates/element-questions.json');
var destination = process.cwd();

var askQuestions = co.wrap(function *() {
  return yield ask(questions);
});

var confirmOverwrite = co.wrap(function *() {
  var hasFiles = !!fs.readdirSync(destination).length;
  if (hasFiles) {
    let isConfirmed = yield prompt({
        type: "confirm",
        name: "confirmation",
        message: chalk.yellow("Do you want to overwite any existing files?"),
        default: false
      });
    if (!isConfirmed) {
      throw 'Aborted.';
    }
  }
  return true;
});

confirmOverwrite()
  .then(askQuestions)
  .then(build)
  .then(finish, abort)
  .catch(function (err) {
    console.log(err.stack);
  });
