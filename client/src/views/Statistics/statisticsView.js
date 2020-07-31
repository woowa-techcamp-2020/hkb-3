import CategoryView from './ categoryView';

class StatisticsView {
  constructor() {
    this.wrap = document.querySelector('.content-wrap');
    this.categoryView = new CategoryView();
  }

  buildSelection = () => {
    const content = `
      <div class="select-wrap">
        <div class="category">
        <label for="category">  
          <input type="radio" name="select" value="category" id="category" checked>
          카테고리 지출
          <span></span>
        </label>
        </div>
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
  
  render(state) {
    this.wrap.innerHTML = this.buildSelection(); 
    this.categoryView.render(state);
  }
}
  
export default StatisticsView;