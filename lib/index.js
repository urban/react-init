'use strict';

import co from 'co';
import { ask, finish, abort } from './api';
import Prompt from './prompt';
import build from './build';
import readline from 'readline';
import fs from 'mz/fs';
import chalk from 'chalk';


var destination = process.cwd();
var readlineInterface = readline.createInterface(process.stdin, process.stdout);
readlineInterface.on('SIGINT', abort);

var prompt = new Prompt(readlineInterface);

var askQuestions = co.wrap(function* () {

  var answers = yield ask(prompt);

  console.warn(chalk.yellow("Your asnwers were:"));
  console.log(JSON.stringify(answers, null, '  '));
  var question = chalk.yellow("Is this ok? ");
  var isConfirmed = yield prompt.confirm({ question, default: true });
  readlineInterface.close();
  return isConfirmed ? answers : null;
});

var confirmOverwrite = co.wrap(function *() {
  var hasFiles = !!fs.readdirSync(destination).length;
  if (hasFiles) {
    let question = chalk.yellow("Do you want to overwite any existing files?");
    let isConfirmed = yield prompt.confirm({ question, default: false });
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
