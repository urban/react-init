'use strict';

import inquirer from 'inquirer';

export default function prompt(question) {
  if (!Array.isArray(question)) {
    question = [question];
  }
  return new Promise(function (resolve, reject) {
    inquirer.prompt.call(null, question, function (answer) {
      var keys = Object.keys(answer);
      if (keys.length > 1) {
        resolve(answer);
      } else {
        resolve(answer[keys[0]]);
      }
    });
  });
};
