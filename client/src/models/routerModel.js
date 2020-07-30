import Observable from './observable';
import { getState, getCurrentPath } from '../common';
import Api from '../api';

class RouterModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async fetchInitData() {
    console.log('fetch start');
    const res = await Api.Transaction().getTransactionByUserId(1);
    this.data = res.data;
    console.log(this.data);
  }

  async onLink(e) {
    const listNode = e.target.closest('li');
    if(!listNode) return;
      
    const path = getCurrentPath(e, listNode);
    this.path = path;
    const state = await getState(path);
    this.state = state;


    history.pushState(state, '', path);  
    super.notify({ state, data: this.data });
  }
}


export default RouterModel;