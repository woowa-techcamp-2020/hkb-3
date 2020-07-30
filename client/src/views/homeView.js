import { elements } from '../common';

class HomeView {
  constructor(data) {
    this.data = data;
  }

  render = (state) => {
    console.log('home', state);
    elements.contentWrap.innerHTML = '<h1>HomeView</h1>';
  }
}

export default HomeView;