import Component from '@glimmer/component';

export default class WeQuoteComponent extends Component {
  get cite() {
    return this.args.cite ?? null;
  }
  get citeUrl() {
    return this.args.citeUrl ?? null;
  }
}
