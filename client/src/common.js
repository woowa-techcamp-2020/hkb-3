import HomeView from './views/homeView';
import CalendarView from './views/calendarView';
// eslint-disable-next-line import/no-cycle
import RouterModel from './models/routerModel';
import StatisticsView from './views/statisticsView';

export const elements = {
  routerModel: new RouterModel(),
  calendarView: new CalendarView(),
  homeView: new HomeView(),
  statisticsView: new StatisticsView(),
  contentWrap: document.querySelector('.content-wrap'),
};

export async function getState(path) {
  switch(path) {
  case '/':
    return Promise.resolve({});
  case '/calendar':
    return { content: 'hello' };
  default:
    break;
  }
}

export function getCurrentPath(e, listNode) {
  if(e.target.nodeName === 'A') e.preventDefault(); 
  const path = listNode.querySelector('a').getAttribute('href');
  return path;
}

export function popStateHandler({ state }) {
  const targetView = getPath();
      
  viewMap[targetView](state?.content);
}

const viewMap = {
  '/': function() {
    elements.homeView.render();
  },
  '/calendar': function(data) {
    elements.calendarView.render(); 
  },
  '/statistics': function (data) {
    elements.statisticsView.render();
  },
  
};

function getPath() {
  return location.pathname;
}
    

