import InitModel from './models/initModel';
import CalendarModel from './models/calendarModel';
import HomeModel from './models/homeModel';
import StatisticsModel from './models/statisticsModel';

const initModeltemp = new InitModel();


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

export const isSpend = (obj) => obj.state === '지출';
export const isIncome = (obj) => obj.state === '수입';



export function fillZeroToDate(date) {
  const dateLength = 2;
  return date.padStart(dateLength, '0');
}

export function sqlDateToDateObj(mysqlDate) { 
  const [year, month, day] = [...mysqlDate.split('-')];
  const dayLength = 2;
  // 달은 0 부터 시작
  const monthIndex = month - 1;
  const jsDate = new Date(year, monthIndex, day.slice(0, dayLength));
  return jsDate;
}

export function getDateFromSqlDate(mysqlDate) { 
  const [, , day] = [...mysqlDate.split('-')];
  const dayLength = 2;
  const date = parseInt(day.slice(0, dayLength));
  return date;
}