'use strict';

import minimist from 'minimist';
import pkg from '../package.json';
import { resolve } from 'path';
import { exists, readFile } from 'mz/fs';
import api from './index';

var help = `
  Usage: react-init [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -o, --output-dir [path]      Set the [path] to the output directory
    -t, --template-dir [path]    Set the [path] to the template directory
    -q, --questions-file [path]  Set the [path] to the questions file
  `;

var argv = minimist(process.argv.slice(2));

var templateDir = getOption('t', 'template-dir') || resolve(__dirname, '../templates/element');
var questionsFile = getOption('q', 'questions-file') || resolve(__dirname, '../templates/element-questions.json');
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

readFile(questionsFile, { encoding: 'utf8' })
  .then(function (result) {
    var questions = JSON.parse(result);
    return api.execute(questions, outputDir);
  })
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
