import Observable from './observable';
import Api from '../api';

class StatisticsModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.renderContent = 'category';
    this.name = 'statistics';
  }


  update(model) {
    this.state = { data: model.state.data };
    this.notify(this);
  }
}


export default StatisticsModel;