'use strict';

import co from 'co';
import path from 'path';
import Prompt from './prompt';
import Metalsmith from 'metalsmith';
import consolidate from 'consolidate';
import fs from 'mz/fs';
import each from 'co-each';

var render = consolidate.handlebars.render;
var prompt = new Prompt();

var askQuestions = co.wrap(function* () {
  return {
    name:         yield prompt.ask("What's your project name? "),
    element:      yield prompt.ask("What is your React elements name? "),
    description:  yield prompt.ask("How would you describe your project? "),
    repository:   yield prompt.ask("What's your repository URL? "),
    author:       yield prompt.ask("What's your full name? "),
    email:        yield prompt.ask("What's your email? ")
  };
});

var confirmAnswers = co.wrap(function *(answers) {
  var message = "Your asnwers were:\n";
  message += JSON.stringify(answers, null, '  ') + "\n";
  message += "Is this ok? ";
  return (yield prompt.confirm(message))? answers : null;
});

var confirmOverwrite = co.wrap(function *() {
  var overwrite = true;
  var hasFiles = !!fs.readdirSync(process.cwd()).length;
  if (hasFiles) {
    overwrite = yield prompt.confirm("Do you want to overwite any existing files? ");
  }
  return true;
});

function writeFiles(answers) {
  return new Promise(function (resolve, reject) {
    if (answers === null) {
      reject();
    }

    var source = path.resolve(__dirname, 'templates/element/');
    var destination = process.cwd();

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
  .then(
    function () {
      prompt.write("Finished.\n");
      prompt.close();
    },
    function () {
      prompt.write("Abort! No files were written.\n");
      prompt.close();
    }
  )
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
