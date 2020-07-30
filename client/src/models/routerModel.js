import Observable from './observable';
import { getCurrentPath, getState } from '../common';
import Api from '../api';

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
    const model = await getState(path);
    this.state = model;
    
    history.pushState(model.state, '', path);  
    super.notify(this.state);
  }
}


export default RouterModel;