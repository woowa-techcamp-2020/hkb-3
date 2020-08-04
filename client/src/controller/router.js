import Observable from '../models/observable';
import { getState, elements, paths } from '../common';
import Api from '../api';
import HomeView from '../views/Home/homeView';
import CalendarView from '../views/Calendar';
import StatisticsView from '../views/Statistics';
import MainView from '../views/Main';

class Router extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();

    this.viewMap = {
      [paths.home](state) {
        new HomeView(state).render();
      },
      [paths.calendar](state) {
        new CalendarView().render(state);
      },
      [paths.statistics](state) {
        new StatisticsView().render(state);
      },
    };
  }

  getCurrentPath = (e, listNode) => {
    if(e.target.nodeName === 'A') e.preventDefault(); 
    const path = listNode.querySelector('a').getAttribute('href');
    return path;
  }
  
  renderByUrl(model) {
    const targetView = this.getPath();
    this.viewMap[targetView](model.state);
  }
  
  getPath = () => location.pathname
  
  /**
   * @description 모델에 해당하는 url 이면 render 합니다.
   * @param {class} model 
   */
  renderByModel(model) {
    if(this.getPath() === paths[model.name]) { this.renderByUrl(model); }
  }


  async onLink(e) {
    const listNode = e.target.closest('li');
    if(!listNode) return;
      
    const path = this.getCurrentPath(e, listNode);
    this.path = path;
    const model = await getState(path);
    this.state = model;
    
    history.pushState(model.state, '', path);  
    this.renderByUrl(this.state);
  }
}


export default Router;