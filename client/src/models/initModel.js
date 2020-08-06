import moment from 'moment';
import Observable from './observable';
import Api from '../api';

class InitModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.state = { date: new Date(moment().format('YYYY-MM-DD hh:mm:ss')) };
  }

  increaseMonth() {
    const curDate = this.state.date;
    this.state.date.setMonth(curDate.getMonth() + 1);
    this.fetchInitData();
    super.notify(this);
  }

  decreaseMonth() {
    const curDate = this.state.date;
    this.state.date.setMonth(curDate.getMonth() - 1);
    this.fetchInitData();
    super.notify(this);
  }

  async fetchInitData() {
    let month = this.state.date.getMonth() + 1;
    if(month < 10) {
      month = `0${month}`;
    }
    const userInfo = await Api.User().getUserInfo();
    const date = `${this.state.date.getFullYear()}-${month}`;
    const res = await Api.Transaction().getTransactionByUserIdAndDate(userInfo.id, date);
    this.state = { ...this.state, data: res.data, userInfo };
    super.notify(this);
  }
}


export default InitModel;