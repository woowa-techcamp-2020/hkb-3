import { isPayment, $ } from '../../../common';
import View from '../../view';
import PieView from './pieVIew';

class CategoryView extends View {
  constructor(...args) {
    super(args);
    this.colors = ['#33cccc', '#00ccff', '#0099ff', '#0066ff', '#3366ff', '#0000ff', '#000099', '#003399', '#3366cc', '#336699'];
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
    this.data.forEach((list) => {
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
    this.data = state.data;
    this.wrap = state.wrap;
    this.categoryObjToList();
    
    const pieView = new PieView({ 
      categoryList: this.categoryList,
      colors: this.colors, 
    });

    this.wrap.innerHTML = `
      <div class="category-wrap">
        ${pieView.buildPi()}
        ${this.buildBar()}
      </div>
    `;
    super.notifyHandlers();
  }
}   
    
export default CategoryView;