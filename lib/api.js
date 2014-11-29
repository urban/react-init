'use strict';

import chalk from 'chalk';

export function *ask(prompt) {
    var answers = {
      name:         yield prompt.ask("What's your project name?"),
      element:      yield prompt.ask("What is your React elements name?"),
      description:  yield prompt.ask("How would you describe your project?"),
      repository:   yield prompt.ask("What's your repository URL?"),
      author:       yield prompt.ask("What's your full name?"),
      email:        yield prompt.ask("What's your email?")
    };

  return answers;
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
