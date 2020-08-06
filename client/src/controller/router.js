import Observable from '../models/observable';
import { getState, paths, elements } from '../common';
import HomeView from '../views/Home/homeView';
import CalendarView from '../views/Calendar';
import StatisticsView from '../views/Statistics';
import Login from '../views/Login';
import SignupView from '../views/Signup';
import $ from '../lib/miniJQuery';

const SELECTOR_HEADER_ROUTER_WRAP = '.js-header-router';


class Router extends Observable {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.setViewMap();
  }

  setViewMap() {
    const router = this;
    this.viewMap = {
      [paths.home](state) {
        new HomeView(state).render();
      },
      [paths.calendar](state) {
        new CalendarView(state).render();
      },
      [paths.statistics](state) {
        new StatisticsView(state).render();
      },
      [paths.login]() {
        new Login().render();
        router.addAuthLink();
      },
      [paths.signup]() {
        new SignupView().render();
        router.addAuthLink();
      },
    };
  }

  addAuthLink() {
    window.addEventListener('popstate', (state) => this.renderByUrl(state));
    $('.nav-button').click((e) => this.authLink(e));
  }

  async init() {
    if(this.getPath() === paths.login) {
      new Login().render();
      this.addAuthLink();
    }else if(this.getPath() === paths.signup) {
      new SignupView().render();
      this.addAuthLink();
    }else{
      await elements.initModel.fetchInitData();
      window.addEventListener('popstate', (state) => this.renderByUrl(state));
      document.querySelector(SELECTOR_HEADER_ROUTER_WRAP)
        .addEventListener('click', (e) => this.onLink(e));
    }
  }

  getCurrentPath = (e) => {
    if(e.target.nodeName === 'A') e.preventDefault(); 
    const path = e.target.getAttribute('href');
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

  async authLink(e) {
    const path = this.getCurrentPath();
    history.pushState(null, '', path);  
    this.viewMap[path](); 
  }


  async onLink(e) {
    if(e.target.nodeName !== 'A') return;
      
    const path = this.getCurrentPath(e);
    this.path = path;
    const model = await getState(path);
    this.state = model;
    
    history.pushState(model.state, '', path);  
    this.renderByUrl(this.state);
  }
}


export default Router;
