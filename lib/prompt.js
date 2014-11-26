'use strict';

import readline from 'readline';
import chalk from 'chalk';

class Prompt {

  constructor(rl) {
    this.rl = rl;
  }

  ask(question) {
    if (!chalk.hasColor(question)) {
      question = chalk.cyan(question);
    }
    return new Promise( resolve => {
      this.rl.question(question, resolve);
    });
  }

  confirm({ question, default: defaultAnswer }) {
    var defaultValue = defaultAnswer ? "(Y/n)" : "(y/N)";
    defaultValue = chalk.gray(defaultValue);
    question = `${question} ${defaultValue}`;
    return this.ask(question)
      .then(function (answer) {
        if (answer === '') {
          answer = defaultAnswer;
        }
        return bool(answer);
      });
  }
}

export default Prompt;

function bool(str) {
  return /^y|yes|ok|true$/i.test(str);
}

