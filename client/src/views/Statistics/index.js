import CategoryView from './CategoryView';
import DayView from './DayView';
import $ from '../../lib/miniJQuery';
import { isSpend, elements } from '../../common';
import numberComma from '../../lib/numberComma';

const IMAGE_TRANSACTION_EMPTY = 'https://i.imgur.com/t0Lantl.png';

class StatisticsView {
  constructor(state) {
    this.state = state;
    this.wrap = document.querySelector('.content-wrap');
    this.categoryView = new CategoryView();
    this.dayView = new DayView();

    this.wrap.innerHTML = this.buildSelection(); 
    this.setSelectInput();
    this.addSelectHandler();
  }

  setSelectInput() {
    const id = this.state.selectedId;
    const input = $(`#${id}`).getNode();
    input.checked = true;
  }


  buildSelection = () => {
    const content = `
      <div class="select-wrap">
        <label for="category">  
          <input type="radio" name="select" value="category" id="category">
          카테고리 지출
          <span></span>
        </label>
        <label for="day">  
          <input type="radio" name="select" value="day" id="day">
          일별 지출
          <span></span>
        </label>
        <div class="month-pay">
          <div>
            이번달 지출 금액: 
          </div>
          <div class="total-spend">
          </div>
        </div>
      </div>
      <div class="statistics-wrap">
      </div>
    `;
    return content;
  }

  addSelectHandler = () => {
    $('.select-wrap').click((event) => {
      const { target } = event;
      if(target.nodeName === 'INPUT') {
        elements.stastisticsModel.setSelectedId(target.id);
        this.render();
      }
    });
  }

  setTotalSpend() {
    $('.total-spend').getNode().innerText = `${numberComma(this.totalSpend)}원`;
  }

  getSpendList() {
    const spends = [];
    this.totalSpend = 0;
    this.state.data.forEach((info) => {
      if(isSpend(info)) {
        spends.push(info);
        this.totalSpend += info.amount;
      }
    });
    return spends;
  }

  render() {
    if(!this.state.data) {
      this.wrap.innerHTML = ` 
        <div class="transaction-contents-none statistice-contents">
          <img src="${IMAGE_TRANSACTION_EMPTY}" width="200">
          <div>거래 내역이 없습니다</div>
        </div>
      `;
    }else{
      const newState = {
        data: this.getSpendList(), 
        wrap: $('.statistics-wrap').getNode(),
        date: this.state.date,
        totalSpend: this.totalSpend,
      };
      this.setTotalSpend();
      const categorySelect = $('#category').getNode();
  
      if(categorySelect.checked) {
        this.categoryView.render(newState);
      }else{
        this.dayView.render(newState);
      }
    }
  }
}
  
export default StatisticsView;