import Observable from './observable';
import Api from '../api';

class StatisticsModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.renderContent = 'category';
    this.name = 'statistics';
  }

  changeContent(renderContent) {
    this.state = { ...this.state, renderContent };
    this.notify(this);
  }

  update(model) {
    this.state = { data: model.state.data, renderContent: this.renderContent };
    this.notify(this);
  }
}


export default StatisticsModel;