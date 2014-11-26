'use strict';

import co from 'co';
import path from 'path';
import readline from 'readline';
import Metalsmith from 'metalsmith';
import consolidate from 'consolidate';
import fs from 'mz/fs';
import each from 'co-each';
import chalk from 'chalk';

var render = consolidate.handlebars.render;
var source = path.resolve(__dirname, '../templates/element/');
var destination = process.cwd();

var rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', abort);

var askQuestions = co.wrap(function* () {
  return {
    name:         yield ask("What's your project name?"),
    element:      yield ask("What is your React elements name?"),
    description:  yield ask("How would you describe your project?"),
    repository:   yield ask("What's your repository URL?"),
    author:       yield ask("What's your full name?"),
    email:        yield ask("What's your email?")
  };
});

var confirmAnswers = co.wrap(function *(answers) {
  console.warn(chalk.yellow("Your asnwers were:"));
  console.log(JSON.stringify(answers, null, '  '));
  var question = chalk.yellow("Is this ok? ");
  var isConfirmed = yield confirm(question);
  return isConfirmed ? answers : null;
});

var confirmOverwrite = co.wrap(function *() {
  var hasFiles = !!fs.readdirSync(destination).length;
  if (hasFiles) {
    let question = chalk.yellow("Do you want to overwite any existing files?");
    let isConfirmed = yield confirm(question, false);
    if (!isConfirmed) {
      throw 'Aborted.';
    }
  }
  return true;
});

function writeFiles(answers) {
  return new Promise(function (resolve, reject) {
    if (answers === null) {
      reject();
    }

    Metalsmith(__dirname)
      .clean(false)
      .source(source)
      .destination(destination)
      .metadata(answers)
      .use(template)
      .build(function (err) {
        if (err) {
          throw err;
        }
        resolve();
      });
  });
}

confirmOverwrite()
  .then(askQuestions)
  .then(confirmAnswers)
  .then(writeFiles)
  .then( finish, abort)
  .catch(function (err) {
    console.log(err.stack);
  });

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function template(files, metalsmith, done) {
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();

  co(function *() {
    yield each(keys, run);
    done();
  });

  function run(key) {
    var str = files[key].contents.toString();
    return new Promise(function (resolve, reject) {
      render(str, metadata, function (err, res) {
        if (err) {
          reject(err);
        }
        files[key].contents = new Buffer(res);
        resolve();
      });
    });
  }
}

function finish(message = 'Finished.') {
  rl.close();
  console.log();
  console.log(chalk.green(message));
  console.log();
  process.exit();
}

function abort(message = 'Aborted.') {
  rl.close();
  console.error();
  console.error(chalk.red(message));
  console.error();
  process.exit(1);
}

function ask(question) {
  if (!chalk.hasColor(question)) {
    question = chalk.cyan(question);
  }
  return new Promise( resolve => {
    rl.question(question, resolve);
  });
}

function confirm(question, defaultAnswer = true) {
  var defaultValue = defaultAnswer ? "(Y/n)" : "(y/N)";
  defaultValue = chalk.gray(defaultValue);
  question = `${question} ${defaultValue}`;
  return ask(question)
    .then(function (answer) {
      if (answer === '') {
        answer = defaultAnswer;
      }
      return bool(answer);
    });
}

function bool(str) {
  return /^y|yes|ok|true$/i.test(str);
}
