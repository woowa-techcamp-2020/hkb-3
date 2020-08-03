import CategoryView from './CategoryView';
import DayView from './DayView';
import $ from '../../lib/miniJQuery';

class StatisticsView {
  constructor(state) {
    this.state = state;
    this.wrap = document.querySelector('.content-wrap');
    this.categoryView = new CategoryView();
    this.dayView = new DayView();

    this.wrap.innerHTML = this.buildSelection(); 
    this.addSelectHandler();
  }

  buildSelection = () => {
    const content = `
      <div class="select-wrap">
        <label for="category">  
          <input type="radio" name="select" value="category" id="category" checked>
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
    return content;
  }

  addSelectHandler = () => {
    $('.select-wrap').click((event) => {
      const { target } = event;
      if(target.nodeName === 'INPUT') {
        this.render();
      }
    });
  }

  
  render() {
    const newState = {
      data: this.state.data, 
      wrap: $('.statistics-wrap').getNode(),
    };
    const categorySelect = $('#category').getNode();

    if(categorySelect.checked) {
      this.categoryView.render(newState);
    }else{
      this.dayView.render(newState);
    }
  }
}
  
export default StatisticsView;