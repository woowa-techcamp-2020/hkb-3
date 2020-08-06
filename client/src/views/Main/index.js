import $ from '../../lib/miniJQuery';
import { fillZeroToDate, elements } from '../../common';
import View from '../view';
import API from '../../api/index';

const APP = '.app';

const SELECTOR_HEADER_ROUTER_TRANSACTION_TEXT = '.header-router__transaction__text';
const SELECTOR_HEADER_ROUTER_CALENDAR_TEXT = '.header-router__calendar__text';
const SELECTOR_HEADER_ROUTER_STATISTICS_TEXT = '.header-router__statistics__text';

const CLASS_CURRENT_ROUTER = 'js-current-router';


class MainView extends View {
  constructor(data) {
    super(data);
    this.data = data;
    this.wrap = $(APP).getNode();
    this.state = null;
  }

  setYearAndMonth = () => {
    const dataNode = $('.main-month').getNode();
    const fixMonth = 1;
    const month = fillZeroToDate((this.state.date.getMonth() + fixMonth).toString());

    dataNode.innerText = `${this.state.date.getFullYear()}.${month}`;
  }

  buildHeader = () => {
    const content = `
        <div class="main-header">
          <div class="header-title-wrap">
              <div class="header-title">우아한 가계부</div>
          </div>
          <nav class="header-router js-header-router">
            <div class="header-router__transaction">
              <a class="header-router__transaction__text js-header-router__transaction__text" href="/">Transaction History</a>
            </div>
            <div class="header-router__calendar">
              <a class="header-router__calendar__text js-header-router__calendar__text" href="/calendar">Calendar</a>
            </div>
            <div class="header-router__statistics">
              <a class="header-router__statistics__text js-header-router__statistics__text" href="/statistics">Statistics</a>
            </div>
          </nav>
          
          <div class="header-user-wrap">
            <div calss="header-user">${elements.initModel.state.userInfo.name} 님</div>
          </div>
          <div class="header-btn-wrap">
            <button class="header-btn js-header-logout-btn">로그아웃</input>
          </div>
        </div>

        <div class="container">
          <div class="main-month-wrap">
              <i class="fas fa-chevron-left" data-action="left"></i>
              <div class="main-month"></div>
              <i class="fas fa-chevron-right" data-action="right"></i>
          </div>
          <div class="content-wrap js-content-wrap"></div>
        </div>  
      `;

    super.addHandler(() => $('.main-month-wrap').click((event) => this.dateChangeHandler(event)));
    return content;
  }

  addLogOutEvent = () => {
    document.querySelector('.js-header-logout-btn').addEventListener('click', async () => {
      window.location.href = '/auth/login';
      const result = await API.Auth().logOut();
    });
  }

  addRouterColorEvent = () => {
    const transRouter = document.querySelector(SELECTOR_HEADER_ROUTER_TRANSACTION_TEXT);
    const calendarRouter = document.querySelector(SELECTOR_HEADER_ROUTER_CALENDAR_TEXT);
    const statisticsRouter = document.querySelector(SELECTOR_HEADER_ROUTER_STATISTICS_TEXT);

    if(window.location.pathname === '/') {
      transRouter.classList.add(CLASS_CURRENT_ROUTER);
    }
    if(window.location.pathname === '/calendar') {
      calendarRouter.classList.add(CLASS_CURRENT_ROUTER);
    }
    if(window.location.pathname === '/statistics') {
      statisticsRouter.classList.add(CLASS_CURRENT_ROUTER);
    }
  }

  dateChangeHandler = (event) => {
    const { target } = event;
    if(target.dataset.action === 'left') {
      elements.initModel.decreaseMonth();
    }else if(target.dataset.action === 'right') {
      elements.initModel.increaseMonth();
    }
  }

  update(model) {
    if(!this.state) {
      this.render();
    }
    this.state = model.state;
    this.setYearAndMonth();
  }

  render() {
    this.wrap.innerHTML = this.buildHeader();
    this.addLogOutEvent();
    this.addRouterColorEvent();
    super.notifyHandlers();
  }
}
  
export default MainView;