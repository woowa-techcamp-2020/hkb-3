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
    this.state = state;
    this.setWrap();
    const totalInOut = this.getTotalIncome(state);
    const contents = `
        <div class="transaction-total-income">
        <input class="transaction-total-income-input" type="checkbox" checked=${this.incomeCheck}>
        <span>수입</span>
        <span>${comma(totalInOut.totalIncome)}</span>
        </div>
        <div class="transaction-total-spend">
        <input class="transaction-total-spend-input" type="checkbox" checked=${this.spendCheck}>
        <span>지출</span>
        <span>${comma(totalInOut.totalSpend)}</div></span>`;
    this.wrap.innerHTML = contents;
    
    super.notifyHandlers();
  }

  // 이번달 총 수입 구해서 리턴
  getTotalIncome = (state) => {
    let totalIncome = 0;
    let totalSpend = 0;
    if(state === undefined || state.length === 0) return { totalIncome, totalSpend };
    
    state.forEach((transaction) => {
      if(transaction.state === '지출') {
        totalSpend += transaction.amount;
      }
      if(transaction.state === '수입') {
        totalIncome += transaction.amount;
      }
    });
    return { totalIncome, totalSpend };
  }
}   
      
export default TotalView;