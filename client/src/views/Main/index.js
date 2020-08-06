import $ from '../../lib/miniJQuery';
import { fillZeroToDate, elements } from '../../common';
import View from '../view';

const APP = '.app';

class MainView extends View {
  constructor(data) {
    super(data);
    this.data = data;
    this.wrap = $('.content-wrap').getNode();
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
              <a class="header-router__transaction__text" href="/">Transaction History</a>
            </div>
            <div class="header-router__calendar">
              <a class="header-router__calendar__text" href="/calendar">Calendar</a>
            </div>
            <div class="header-router__statistics">
              <a class="header-router__statistics__text" href="/statistics">Statistics</a>
            </div>
          </nav>
          
          <div class="header-user-wrap">
            <div calss="header-user">이찬호님</div>
          </div>
          <div class="header-btn-wrap">
            <button class="header-btn">로그아웃</input>
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
    super.notifyHandlers();
  }
}
  
export default MainView;