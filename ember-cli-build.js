'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-markdown-templates': {
      syntaxHighlight: true,
    },
  });

  // Import highlight styles
  app.import('node_modules/highlightjs/styles/a11y-dark.css');

  return app.toTree();
};
