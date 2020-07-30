import Observable from './observable';
import Api from '../api';

class InitModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async fetchInitData() {
    const userId = 1;
    const res = await Api.Transaction().getTransactionByUserId(userId);
    this.data = res.data;
    super.notify(this);
  }
}


export default InitModel;