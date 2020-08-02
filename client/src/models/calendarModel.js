import Observable from './observable';
import Api from '../api';

class CalendarModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.name = 'calendar';
  }

  update(model) {
    this.state = model.state;
    this.notify(this);
  }
}


export default CalendarModel;