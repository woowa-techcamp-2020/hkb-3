import { isPayment } from '../../common';

class CategoryView {
  setWrap() {
    this.wrap = document.querySelector('.statistics-wrap');
    this.colors = ['#33cccc', '#00ccff', '#0099ff', '#0066ff', '#3366ff', '#0000ff', '#000099', '#003399', '#3366cc', '#336699'];
  }

  buildPi = () => {
    const content = `
    <div class="pi-wrap">
      <svg viewBox="0 0 32 32">
        <circle class='first' stroke-dasharray="34 100"></circle>
        <circle class='second' stroke-dasharray="36 100"></circle>
        <circle class='third' stroke-dasharray="3 100"></circle>
        <text x="5" y="-11" fill="#fff">65%</text>
        <text x="15" y="-26" fill="#fff">5%</text>
        <text x="18" y="-17" fill="#fff">35%</text>
      </svg>
    </div>
    `;
    return content;
  }


  buildBar = () => {
    let content = '<div class="bar-wrap">';
    const numberOfColors = this.colors.length;
    this.data.forEach((payment, i) => {
      content += `
        <div class="content-wrap">
          <div>
            ${payment.category_name}
          </div>
          <div class="percentage">
            ${payment.percentage}%
          </div>
          <div>
            <svg width="100%" height="30">
              <rect width="${payment.percentage}%" height="100%" fill=${this.colors[i % numberOfColors]} />
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

  stateToList = (state) => {
    const obj = {};
    let totalAmount = 0;
    state.forEach((list) => {
      if(obj[list.category_name] && isPayment(list)) {
        obj[list.category_name].amount += list.amount;
        totalAmount += list.amount;
      }else if(!obj[list.id] && isPayment(list)) {
        obj[list.category_name] = { amount: list.amount };
        totalAmount += list.amount;
      }
    });

    this.data = [];
    let totalPercentage = 0;
    const maxPercentage = 100;
    Object.keys(obj).forEach((key) => {
      const { amount } = obj[key];
      const percentage = parseInt(((amount / totalAmount) * 100));
      totalPercentage += percentage;
      this.data.push({ amount, category_name: key, percentage });
    });
    this.data.sort((a, b) => b.amount - a.amount);
    this.data[0].percentage += maxPercentage - totalPercentage;
  }

  render(state) {
    this.setWrap();
    this.stateToList(state);
    // console.log(state);
    this.wrap.innerHTML = `
      <div class="category-wrap">
        ${this.buildPi()}
        ${this.buildBar()}
      </div>
    `;
  }
}   
    
export default CategoryView;