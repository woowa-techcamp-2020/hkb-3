import { isPayment, $ } from '../../common';
import View from '../view';

class CategoryView extends View {
  constructor(...args) {
    super(args);
  }

  setWrap() {
    this.wrap = document.querySelector('.statistics-wrap');
    this.colors = ['#33cccc', '#00ccff', '#0099ff', '#0066ff', '#3366ff', '#0000ff', '#000099', '#003399', '#3366cc', '#336699'];
    this.handlers = [];
  }

  makePercentSumList() {
    const percentSumList = [];
    const reversedList = this.categoryList.slice();
    reversedList.reverse();
    reversedList.reduce((prev, value) => {
      const newValue = value.percent + prev; 
      console.log(value);
      percentSumList.unshift({ percentSum: newValue, name: value.category_name });
      return newValue;
    }, 0);

    // 100으로 그래프 채우면 1만큼 비기때문에 101로 바꿔준다.
    const errorValue = 1;
    percentSumList[0].percentSum += errorValue;
    console.log(percentSumList);
    return percentSumList;
  }

  buildCircle() {
    const percentSumList = this.makePercentSumList();
    let content = '';
    percentSumList.forEach((info, i) => {
      content += `
        <circle class="pie" stroke-dasharray="${info.percentSum} 100" stroke="${this.colors[i]}"></circle>
      `;
    });
    // super.addHandler(() => $('.first').click(() => console.log(1)));
    return content;
  }

  

  buildPi = () => {
    const content = `
    <div class="pi-wrap">
      <svg viewBox="0 0 32 32">
        ${this.buildCircle()}
      </svg>
    </div>
    `;
    return content;
  }


  buildBar = () => {
    let content = '<div class="bar-wrap">';
    const numberOfColors = this.colors.length;
    this.categoryList.forEach((payment, i) => {
      content += `
        <div class="content-wrap">
          <div>
            ${payment.category_name}
          </div>
          <div class="percent">
            ${payment.percent}%
          </div>
          <div>
            <svg width="100%" height="30">
              <rect width="${payment.percent}%" height="100%" fill=${this.colors[i % numberOfColors]} />
            </svg>
          </div>
          <div class="amount">
            ${payment.amount}원
          </div>
        </div>
      `;
    });
    content += '</div>';
    return content;
  }

  stateToCategoryObj() {
    const obj = {};
    let totalAmount = 0;
    this.state.forEach((list) => {
      if(obj[list.category_name] && isPayment(list)) {
        obj[list.category_name].amount += list.amount;
        totalAmount += list.amount;
      }else if(!obj[list.id] && isPayment(list)) {
        obj[list.category_name] = { amount: list.amount };
        totalAmount += list.amount;
      }
    });
    return { obj, totalAmount };
  }

  categoryObjToList = () => {
    const { obj, totalAmount } = this.stateToCategoryObj();

    this.categoryList = [];
    let totalPercent = 0;
    const maxPercent = 100;
    Object.keys(obj).forEach((key) => {
      const { amount } = obj[key];
      const percent = parseInt(((amount / totalAmount) * 100));
      totalPercent += percent;
      this.categoryList.push({ amount, category_name: key, percent });
    });
    this.categoryList.sort((a, b) => b.amount - a.amount);
    this.categoryList[0].percent += maxPercent - totalPercent;
  }

  render(state) {
    this.state = state;
    this.setWrap();
    this.categoryObjToList();
    this.wrap.innerHTML = `
      <div class="category-wrap">
        ${this.buildPi()}
        ${this.buildBar()}
      </div>
    `;
    super.notifyHandlers();
  }
}   
    
export default CategoryView;