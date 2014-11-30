'use strict';

import co from 'co';
import Prompt from './prompt';
import path from 'path';
import readline from 'readline';
import Metalsmith from 'metalsmith';
import consolidate from 'consolidate';
import each from 'co-each';

var render = consolidate.handlebars.render;
var source = path.resolve(__dirname, '../templates/element/');
var destination = process.cwd();

export default build;

function build(metadata) {
  return new Promise(function (resolve, reject) {
    if (metadata === null) {
      reject();
    }

    Metalsmith(source)
      .clean(false)
      .source(source)
      .destination(destination)
      .metadata(metadata)
      .use(template)
      .build(function (err) {
        if (err) {
          throw err;
        }
        resolve();
      });
  });
}

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
