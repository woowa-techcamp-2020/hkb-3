import Observable from './observable';
import Api from '../api';

class StatisticsModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.renderContent = 'category';
    this.name = 'statistics';
    this.selectedId = 'category';
  }

  setSelectedId(elementID) {
    this.selectedId = elementID;
  }


  update(model) {
    this.state = { data: model.state.data, date: model.state.date, selectedId: this.selectedId };
    this.notify(this);
  }
}


export default StatisticsModel;