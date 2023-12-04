import EmberRouter from '@ember/routing/router';
import config from 'why-ember/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('ember-for-react-developers');
  this.route('addon-awards', function () {});

  this.route('addons', function () {
    this.route('2021');
    this.route('2023');
  });
});
