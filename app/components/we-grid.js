import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WeGridComponent extends Component {
  @tracked currentVisible;

  @action
  updateCurrentVisible(visible) {
    this.currentVisible = visible;
  }
}
