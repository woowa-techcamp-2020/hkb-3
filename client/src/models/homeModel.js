import Observable from './observable';
import Api from '../api';

class HomeModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.name = 'home';
  }

  update(model) {
    this.state = model.data;
    this.notify(this);
  }
}


export default HomeModel;