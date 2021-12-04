import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WeGridItemComponent extends Component {
  @tracked isShowing = false;

  @action
  toggleShowing() {
    this.isShowing = !this.isShowing;
  }
}
