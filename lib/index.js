'use strict';

import co from 'co';
import prompt from './prompt';
import build from './build';
import readline from 'readline';
import fs from 'mz/fs';
import chalk from 'chalk';

export function execute(questions, destination) {

  questions = questions || require('../templates/element-questions.json');
  destination = destination || process.cwd();

  var askQuestions = co.wrap(function *() {
    return yield ask(questions);
  });

  var confirmWrite = co.wrap(function *() {
    if (!fs.readdirSync(destination).length) {
      return;
    }
    var isConfirmed = yield prompt({
        type: "confirm",
        name: "confirmation",
        message: chalk.yellow("Do you want to overwite any existing files?"),
        default: false
      });
    if (!isConfirmed) {
      throw 'Aborted.';
    }
  });

  return confirmWrite()
    .then(askQuestions)
    .then(build);
}

export function *ask(questions) {
  var answers = yield prompt(questions);
  console.warn(chalk.yellow("Your answers were:"));
  console.log(JSON.stringify(answers, null, '  '));
  var isConfirmed = yield prompt({
      type: "confirm",
      name: "confirmation",
      message: "Is this ok?"
    });
  return isConfirmed ? answers : null;
}

export function finish(message) {
  console.log();
  console.log(chalk.green(message));
  console.log();
}

export function abort(message) {
  console.error();
  console.error(chalk.red(message));
  console.error();
}
