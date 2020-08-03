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
  initModel: initModeltemp,
  calendarModel: new CalendarModel(),
  homeModel: new HomeModel(),
  stastisticsModel: new StatisticsModel(),  
  contentWrap: document.querySelector('.content-wrap'),
};


export const paths = {
  home: '/',
  calendar: '/calendar',
  statistics: '/statistics',
};


export function getState(path) {
  switch(path) {
  case paths.home:
    return elements.homeModel;
  case paths.calendar:
    return elements.calendarModel;
  case paths.statistics:
    return elements.stastisticsModel;
  default:
    return null;
  }
}

export const isPayment = (obj) => obj.state === '지출';


export function fillZeroToDate(date) {
  const dateLength = 2;
  return date.padStart(dateLength, '0');
}