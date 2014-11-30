'use strict';

import minimist from 'minimist';
import pkg from '../package.json';
import { resolve } from 'path';
import { exists } from 'mz/fs';
import questions from './questions';

var help = `
  Usage: react-init [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -o, --output-dir [path]      Set the [path] to the output directory
    -t, --template-dir [path]    Set the [path] to the template directory
    -q, --questions-file [path]  Set the [path] to the additional questions file
  `;

var argv = minimist(process.argv.slice(2));

var templateDir = getOption('t', 'template-dir') || resolve(__dirname, '../templates/element');
var questionsFile = getOption('q', 'questions-file') || resolve(__dirname, '../templates/element-questions');
var outputDir = getOption('o', 'output-dir') || resolve(process.cwd());

if (hasOption('h', 'help')) {
  console.log(help);
  process.exit();
}

if (hasOption('V', 'version')) {
  console.log(pkg.version);
  process.exit();
}

if (!exists(questionsFile)) {
  abort('Could not find the questions file.');
}

// TODO: an error in 6to5 will not let me use variable for module package names
var additionalQuestions = require(questionsFile).questions;
// TODO: because of an error in gnode which is included by Metalsmith
// I have to import the api after all other imports otherwise
// it barfs on es6 modules e.g. reserved words such as export
import api from './index';

questions = questions.concat(additionalQuestions);

api
  .execute(questions, outputDir)
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

function getOption(...options) {
  return argv[hasOption(...options)];
}

function hasOption(...options) {
  return options.find(function (option) {
    return argv.hasOwnProperty(option);
  });
}
