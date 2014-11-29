'use strict';

import chalk from 'chalk';
import prompt from './prompt';

export function *ask(questions) {
  var answers = yield prompt(questions);
  console.warn(chalk.yellow("Your asnwers were:"));
  console.log(JSON.stringify(answers, null, '  '));
  // var question = chalk.yellow("Is this ok? ");
  var isConfirmed = yield prompt({
      type: "confirm",
      name: "confirmation",
      message: "Is this ok?"
    });
  return isConfirmed ? answers : null;
}

export function finish(message = 'Finished.') {
  console.log();
  console.log(chalk.green(message));
  console.log();
  process.exit();
}

export function abort(message = 'Aborted.') {
  console.error();
  console.error(chalk.red(message));
  console.error();
  process.exit(1);
}
