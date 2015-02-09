'use strict';

import React from 'react';

export default React.createClass({

  displayName: '{{element}}',

  render() {
    return (
      <div {...this.props}>
        Hello World!
      </div>
    );
  }
});
