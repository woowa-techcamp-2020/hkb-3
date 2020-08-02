import HomeView from './views/Home/homeView';
import CalendarView from './views/Calendar';
import StatisticsView from './views/Statistics';
import RouterModel from './models/routerModel';
import InitModel from './models/initModel';
import CalendarModel from './models/calendarModel';
import HomeModel from './models/homeModel';
import StatisticsModel from './models/statisticsModel';

const initModeltemp = new InitModel();

export const $ = (str) => {
  const element = document.querySelector(str);
  return {
    click(handler) {
      element.addEventListener('click', handler);
    },
    getNode() {
      return element;
    },
  };
};

export const elements = {
  routerModel: new RouterModel(),
  initModel: initModeltemp,
  calendarModel: new CalendarModel(),
  homeModel: new HomeModel(),
  stastisticsModel: new StatisticsModel(),
  calendarView: new CalendarView(),
  homeView: new HomeView(initModeltemp),
  statisticsView: new StatisticsView(),
  
  contentWrap: document.querySelector('.content-wrap'),
};


export const paths = {
  home: '/',
  calendar: '/calendar',
  statistics: '/statistics',
};

export function getCurrentPath(e, listNode) {
  if(e.target.nodeName === 'A') e.preventDefault(); 
  const path = listNode.querySelector('a').getAttribute('href');
  return path;
}

export function getState(path) {
  switch(path) {
  case paths.home:
    return elements.homeModel;
  case paths.calendar:
    return elements.calendarModel;
  case paths.statistics:
    return elements.stastisticsModel;
  default:
    
    break;
  }
}

const viewMap = {
  [paths.home](state) {
    elements.homeView.render(state);
  },
  [paths.calendar](state) {
    elements.calendarView.render(state); 
  },
  [paths.statistics](state) {
    elements.statisticsView.render(state);
  },
};

export function renderByUrl({ state }) {
  const targetView = getPath();
  viewMap[targetView](state);
}

export function getPath() {
  return location.pathname;
}

/**
 * @description 모델에 해당하는 url 이면 render 합니다.
 * @param {class} model 
 */
export function renderByModel(model) {
  if(getPath() === paths[model.name]) { renderByUrl(model); }
}

export const isPayment = (obj) => obj.state === '지출';


export function fillZeroToDate(date) {
  const dateLength = 2;
  return date.padStart(dateLength, '0');
}