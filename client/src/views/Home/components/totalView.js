import View from '../../view';
import comma from '../../../lib/numberComma';


const SELECTOR_TRANSACTION_TOTAL = '.js-transaction-total';
const SELECTOR_TRANSACTION_TOTAL_INCOME_CHECKBOX = '.js-transaction-total-income__checkbox';
const SELECTOR_TRANSACTION_TOTAL_SPEND_CHECKBOX = '.js-transaction-total-spend__checkbox';

class TotalView extends View {
  constructor(...args) {
    super(args);
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
    this.addEventToCheckbox();
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

  // 체크박스 이벤트 추가
  addEventToCheckbox = () => {
    this.addIncomeCheckboxEvent();
    this.addSpendCheckboxEvent();
  }

  // 수입 체크박스 이벤트 추가
  addIncomeCheckboxEvent = () => {
    const incomeCheckbox = document.querySelector(SELECTOR_TRANSACTION_TOTAL_INCOME_CHECKBOX);
    incomeCheckbox.addEventListener('click', () => {
      this.incomeCheck = incomeCheckbox.checked;
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }

  // 지출 체크박스 이벤트 추가
  addSpendCheckboxEvent = () => {
    const spendCheckbox = document.querySelector(SELECTOR_TRANSACTION_TOTAL_SPEND_CHECKBOX);
    spendCheckbox.addEventListener('click', () => {
      this.spendCheck = spendCheckbox.checked;
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }
}   
      
export default TotalView;