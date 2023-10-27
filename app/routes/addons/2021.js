import Route from '@ember/routing/route';

export default class Addons2021Route extends Route {
  async model() {
    let response = await fetch('/data/2021-addons.json');

    let data = await response.json();

    return {
      addons: data,
    };
  }
}
