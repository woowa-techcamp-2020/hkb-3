import View from '../../view';
import comma from '../../../lib/numberComma';

class TotalView extends View {
  constructor(...args) {
    super(args);
  }
  
  setWrap() {
    this.wrap = document.querySelector('.transaction-total');
  }

  render(state) {
    this.setWrap();
    const totalInOut = this.getTotalIncome(state);
    const contents = `
      <label class="transaction-total-income">
        <input class="transaction-total-income-input" type="checkbox" checked=${this.incomeCheck}>
        <span>수입</span>
        <span class="transaction-total-income-amount">+${comma(totalInOut.totalIncome)} 원</span>
      </label>
      <label class="transaction-total-spend">
        <input class="transaction-total-spend-input" type="checkbox" checked=${this.spendCheck}>
        <span>지출</span>
        <span class="transaction-total-spend-amount">-${comma(totalInOut.totalSpend)} 원</span>
      </label>
    `;

    this.wrap.innerHTML = contents;
    
    super.notifyHandlers();
  }

  // 이번달 총 수입 구해서 리턴
  getTotalIncome = (state) => {
    let totalIncome = 0;
    let totalSpend = 0;
    if(state === undefined || state.length === 0) return { totalIncome, totalSpend };
    
    state.forEach((transaction) => {
      if(transaction.state === 'spend') {
        totalSpend += transaction.amount;
      }
      if(transaction.state === 'income') {
        totalIncome += transaction.amount;
      }
    });
    return { totalIncome, totalSpend };
  }
}   
      
export default TotalView;