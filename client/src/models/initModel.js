import Observable from './observable';
import Api from '../api';

class InitModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.state = { date: new Date() };
  }

  increaseMonth() {
    const curDate = this.state.date;
    this.state.date.setMonth(curDate.getMonth() + 1);
    super.notify(this);
  }

  decreaseMonth() {
    const curDate = this.state.date;
    this.state.date.setMonth(curDate.getMonth() - 1);
    super.notify(this);
  }

  async fetchInitData() {
    const userId = 1;
    const res = await Api.Transaction().getTransactionByUserId(userId);
    this.state = { ...this.state, data: res.data };
    super.notify(this);
  }
}


export default InitModel;