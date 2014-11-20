'use strict';

var React = require('react');
var {{element}} = require('{{name}}');

require('normalize.css/normalize.css');
require('./styles.css');

class Application {

  render() {
    return (
      <div>
        <fieldset>
          <legend>Default</legend>

          <{{element}} />

        </fieldset>
      </div>
    );
  }
}

var ApplicationTag = React.createClass(Application.prototype);

if (typeof window !== 'undefined') {
  React.render(
    <ApplicationTag />,
    document.querySelector('#react')
  );
}

module.exports = ApplicationTag;
