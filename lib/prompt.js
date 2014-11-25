'use strict';

import readline from 'readline';

class Prompt {

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  ask(message) {
    return new Promise( resolve => {
      this.rl.question(message, resolve);
    });
  }

  confirm(message) {
    return this
      .ask(message)
      .then(answer => {
        return bool(answer);
      });
  }

  write(message) {
    this.rl.write(message);
  }

  close() {
    this.rl.close();
  }
}

function bool(str) {
  return /^y|yes|ok|true$/i.test(str);
}

export default Prompt;
