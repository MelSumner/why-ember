import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | addons/2021', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:addons/2021');
    assert.ok(route);
  });
});
