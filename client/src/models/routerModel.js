import Observable from './observable';
import { getState, getCurrentPath } from '../common';

class RouterModel extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async onLink(e) {
    const listNode = e.target.closest('li');
    if(!listNode) return;
      
    const path = getCurrentPath(e, listNode);
    this.path = path;
    const state = await getState(path);
    this.state = state;


    history.pushState(state, '', path);  
    super.notify({ state });
  }
}


export default RouterModel;