'use strict';

var path = require('path');
var inquirer = require('inquirer');
var async = require('async');
var Metalsmith = require('metalsmith');
var render = require('consolidate').handlebars.render;
Object.assign = require('object-assign');

var metalsmith;

/**
 * Questions
 *
 * @type {Array}
 */
var questions = [
  {
    type: 'input',
    name: 'name',
    message: 'What\'s your project name?',
    default: 'my-element'
  },
  {
    type: 'input',
    name: 'element',
    message: 'What is your React elements name?',
    default: 'MyElement'
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please describe your project:'
  },
  {
    type: 'input',
    name: 'repository',
    message: 'What\'s your repository URL?'
  },
  {
    type: 'input',
    name: 'author',
    message: 'What\'s your full name?'
  },
  {
    type: 'input',
    name: 'email',
    message: 'What\'s your email?'
  }
];

if (!module.parent) {
  build();
}

module.exports = build;

/**
 * Build.
 */
function build() {

  var sourcePath = path.resolve(__dirname, 'templates/element/');

  metalsmith = Metalsmith(__dirname)
  .source(sourcePath)
  .use(ask)
  .use(template)
  .clean(false)
  .destination(process.cwd())
  .build(function (err) {
    if (err) {
      throw err;
    }
  });
}

/**
 * Prompt plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function ask(files, metalsmith, done) {
  var metadata = metalsmith.metadata();

  inquirer.prompt(questions, function (answers) {
    confirmAnswers(answers, function (isValid) {
      Object.assign(metadata, answers);
      done();
    });
  });
}


/**
 * Confirm prompt plugin answers
 *
 * @param  {Object}   answers
 * @param  {Function} callback
 */
function confirmAnswers(answers, callback) {
  var question = {
    type: 'confirm',
    name: 'valid',
    message: getMessage()
  };

  inquirer.prompt(question, handleResponse);

  function handleResponse(response) {
    callback(response.valid)
  }

  function getMessage() {
    var message = 'Is this ok? \n';
    message += JSON.stringify(answers, null, '  ');
    return message;
  }
}

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

  async.each(keys, run, done);

  function run(file, done) {
    var str = files[file].contents.toString();
    render(str, metadata, function (err, res) {
      if (err) {
        return done(err);
      }
      files[file].contents = new Buffer(res);
      done();
    });
  }
}
