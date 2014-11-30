'use strict';

import program from 'commander';
import pkg from '../package.json';
import { resolve } from 'path';
import { existsSync as exists } from 'fs';
import api from './index';

var defaults = {
  templateDir: resolve(__dirname, '../templates/element'),
  questionsFile: resolve(__dirname, '../templates/element-questions.json'),
  outputDir: resolve(process.cwd())
}

program
  .version(pkg.version)
  .option('-o, --output-dir [path]', 'Set the [path] to the output directory', defaults.outputDir)
  .option('-t, --template-dir [path]', 'Set the [path] to the template directory', defaults.templateDir)
  .option('-q, --questions-file [path]', 'Set the [path] to the questions file', defaults.questionsFile)
  .parse(process.argv);

if (!exists(program.questionsFile)) {
  api.abort('Could not find the questions file.');
}

// TODO: use module syntax
var questions = require(program.questionsFile);

api
  .execute(questions, program.outputDir)
  .then(finish, abort)
  .catch(function (error) {
    console.log(error.stack);
  });

function finish(message = 'Finished.') {
  api.finish(message);
  process.exit();
}

function abort(message = 'Aborted.') {
  api.abort(message);
  process.exit(1);
}
