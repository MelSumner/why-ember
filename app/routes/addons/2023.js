import Route from '@ember/routing/route';

export default class Addons2023Route extends Route {
  async model() {
    let response = await fetch('/data/2023-addons.json');

    let data = await response.json();

    return {
      addons: data,
    };
  }
}
