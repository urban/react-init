'use strict';

import co from 'co';
import Prompt from './prompt';
import path from 'path';
import readline from 'readline';
import Metalsmith from 'metalsmith';
import consolidate from 'consolidate';
import each from 'co-each';
import { filter } from 'minimatch';

let render = consolidate.handlebars.render;
let source = path.resolve(__dirname, '../templates/element/');
let destination = process.cwd();
let exclude = filter('!.DS_Store', '!node_modules');

let renameMatches = {
  'lib/index.jsx': ({element}) => {
    return `lib/${element}.jsx`;
  },
  'test/index-test.jsx': ({element}) => {
    return `test/${element}-test.jsx`;
  }
};

export default function build(metadata) {
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
  let metadata = metalsmith.metadata();
  let keys = Object.keys(files)
    .filter(exclude);

  co(function *() {
    yield each(keys, run);
    yield each(keys, rename);
    done();
  });

  function rename(key) {
    if (renameMatches[key] === undefined) return;
    let data = files[key];
    let newKey = renameMatches[key](metadata);
    delete files[key];
    files[newKey] = data;
  }

  function run(key) {
    let str = files[key].contents.toString();
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
