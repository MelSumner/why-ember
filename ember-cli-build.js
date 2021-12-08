'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    'ember-prism': {
      theme: 'twilight',
      components: ['markup', 'handlebars', 'javascript'],
      plugins: ['toolbar', 'copy-to-clipboard'],
    },
  });

  app.import('app/styles/prism-dracula.css');
  return app.toTree();
};
