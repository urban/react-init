'use strict';

import co from 'co';
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

  var answers = {
    name:         yield prompt.ask("What's your project name?"),
    element:      yield prompt.ask("What is your React elements name?"),
    description:  yield prompt.ask("How would you describe your project?"),
    repository:   yield prompt.ask("What's your repository URL?"),
    author:       yield prompt.ask("What's your full name?"),
    email:        yield prompt.ask("What's your email?")
  };

  console.warn(chalk.yellow("Your asnwers were:"));
  console.log(JSON.stringify(answers, null, '  '));
  var question = chalk.yellow("Is this ok? ");
  var isConfirmed = yield prompt.confirm({ question, default: true });
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

function finish(message = 'Finished.') {
  console.log();
  console.log(chalk.green(message));
  console.log();
  readlineInterface.close();
  process.exit();
}

function abort(message = 'Aborted.') {
  console.error();
  console.error(chalk.red(message));
  console.error();
  readlineInterface.close();
  process.exit(1);
}
