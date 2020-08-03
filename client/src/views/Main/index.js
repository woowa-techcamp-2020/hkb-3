import $ from '../../lib/miniJQuery';
import { fillZeroToDate, elements } from '../../common';
import View from '../view';

class MainView extends View {
  constructor(data) {
    super(data);
    this.data = data;
    this.wrap = $('.content-wrap').getNode();
    this.wrap = $('.wrap').getNode();
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
            <div class=title>
                우아한 가계부
            </div> 
            </div>
            <div class="container">
            <div class="main-month-wrap">
                <i class="fas fa-caret-square-left" data-action="left"></i>
                <div class="main-month">
                
                </div>
                <i class="fas fa-caret-square-right" data-action="right"></i>
            </div>
            <nav class="main-router-wrap">
                <ul>
                    <li><a href="/" class="content">내역</a></li>
                    <li><div class="empty-line"></div></li>
                    <li><a href="/calendar" class="content">달력</a></li>
                    <li><div class="empty-line"></div></li>
                    <li><a href="/statistics" class="content">통계</a></li>
                </ul>
            </nav>
            <div class="content-wrap">

            </div>
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