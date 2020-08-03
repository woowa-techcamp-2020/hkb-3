import CategoryView from './CategoryView';
import DayView from './DayView';

import View from '../view';
import { elements } from '../../common';
import $ from '../../lib/miniJQuery';

class StatisticsView extends View {
  constructor(arg) {
    super(arg);
    this.wrap = document.querySelector('.content-wrap');
    this.categoryView = new CategoryView();
    this.dayView = new DayView();
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
          <div>
            100,000원
          </div>
        </div>
      </div>
      <div class="statistics-wrap">
      </div>
    `;
    super.addHandler(() => $('.select-wrap').click((e) => this.selectHandler(e)));
    return content;
  }

  selectHandler = (event) => {
    const { target } = event;
    if(target.nodeName === 'INPUT') {
      const renderContent = target.value; 
      elements.stastisticsModel.changeContent(renderContent);
    }
  }

  setDefaultSelected = (renderContent) => {
    $(`input[id="${renderContent}"]`).getNode().checked = true;
  }
  
  render(state) {
    this.wrap.innerHTML = this.buildSelection(); 
    const { renderContent } = state;
    this.setDefaultSelected(renderContent);
    const newState = {
      data: state.data, 
      wrap: $('.statistics-wrap').getNode(),
    };
    if(renderContent === 'category') {
      this.categoryView.render(newState);
    }else{
      this.dayView.render(newState);
    }
    super.notifyHandlers();
  }
}
  
export default StatisticsView;