import View from '../../view';
import comma from '../../../lib/numberComma';


const SELECTOR_TRANSACTION_TOTAL = '.js-transaction-total';

class TotalView extends View {
  constructor(...args) {
    super(args);
    [this.transListView] = args;
    if(this.transListView !== undefined) {
      this.transactionList = this.transListView.state;
    }
    this.incomeCheck = true;
    this.spendCheck = true;
  }
  
  setWrap() {
    this.wrap = document.querySelector(SELECTOR_TRANSACTION_TOTAL);
  }

  render(state) {
    this.setWrap();
    const totalInOut = this.getTotalIncomeSpend(state);
    const contents = `
      <label class="transaction-total-income js-transaction-total-income">
        <input class="transaction-total-income__checkbox js-transaction-total-income__checkbox" type="checkbox" checked=${this.incomeCheck}>
        <span class="transaction-total-income__text">수입</span>
        <span class="transaction-total-income__amount">+${comma(totalInOut.totalIncome)} 원</span>
      </label>
      <label class="transaction-total-spend js-transaction-total-spend">
        <input class="transaction-total-spend__checkbox js-transaction-total-spend__checkbox" type="checkbox" checked=${this.spendCheck}>
        <span class="transaction-total-spend__text">지출</span>
        <span class="transaction-total-spend__amount">-${comma(totalInOut.totalSpend)} 원</span>
      </label>
    `;
    this.wrap.innerHTML = contents;
    super.notifyHandlers();
  }

  // 이번달 총 수입 구해서 리턴
  getTotalIncomeSpend = (state) => {
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