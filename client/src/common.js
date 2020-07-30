
import HomeView from './views/homeView';
import CalendarView from './views/Calendar/calendarView';
import StatisticsView from './views/statisticsView';
import PaymentModel from './models/paymentListModel';
import RouterModel from './models/routerModel';

export const elements = {
  routerModel: new RouterModel(),
  paymentModel: new PaymentModel(),
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

const viewMap = {
  '/': function() {
    // elements.paymentModel.getInitialData();
    elements.homeView.render();
  },
  '/calendar': function(data) {
    elements.calendarView.render(); 
  },
  '/statistics': function (data) {
    elements.statisticsView.render();
  },
  
};

export function popStateHandler({ state }) {
  const targetView = getPath();
  viewMap[targetView](state?.content);
}

function getPath() {
  return location.pathname;
}
    

