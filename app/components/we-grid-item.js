import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class WeGridItemComponent extends Component {
  itemId = guidFor(this);

  get isShowing() {
    return this.itemId === this.args.currentVisible;
  }

  @action
  toggleShowing() {
    this.args.updateCurrentVisible(this.itemId);
  }

  @action
  closeExpand() {
    this.args.updateCurrentVisible();
  }
}
