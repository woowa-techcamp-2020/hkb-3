import View from '../../view';
import comma from '../../../lib/numberComma';

class TransListView extends View {
  constructor(...args) {
    super(args);
    this.dayIncome = 0;
    this.daySpend = 0;
    this.dayTotal = new Map();
  }
  
  setWrap() {
    this.wrap = document.querySelector('.transaction-list');
  }

  calcDayTotal=(state) => {
    this.dayTotal = new Map();
    state.forEach((transaction) => {
      let income = 0;
      let spend = 0;

      if(transaction.state === '지출') {
        spend += transaction.amount;
      }
      if(transaction.state === '수입') {
        income += transaction.amount;
      }

      // 현재 날짜가 없으면
      if(!this.dayTotal.has(transaction.date)) {
        this.dayTotal.set(transaction.date, { income, spend });
      }else{
        const total = this.dayTotal.get(transaction.date);
        total.income += income;
        total.spend += spend;
        this.dayTotal.set(transaction.date, total);
        // total.income += transaction.amount;
      }
    });
  }
  
  render(state, incomeCheck, spendCheck) {
    this.state = state;
    this.calcDayTotal(state);
    this.setWrap();
    if(incomeCheck || spendCheck) {
      this.wrap.innerHTML = `
        ${state.map((transaction) => `
          ${this.isChecked(transaction, incomeCheck, spendCheck) ? `
            ${this.listDateRender(transaction, incomeCheck, spendCheck)}
            <div class="transaction-contents ${transaction.id}">
              <span class="transaction-column-category-${this.isIncome(transaction) ? 'income' : 'spend'}">${transaction.category_name}</span>
              <span class="transaction-column-contents">${transaction.contents}</span>
              <span class="transaction-column-method">${transaction.payment_method}</span>
              <span class="transaction-column-amount-${this.isIncome(transaction) ? 'income' : 'spend'}">
                ${this.isIncome(transaction) ? `+${comma(transaction.amount)}` : `-${comma(transaction.amount)}`}
              </span>
            </div>
          ` : ''}
        `).join('')}
      `;
    }else{
      this.wrap.innerHTML = `
        <div class="transaction-contents-none">
            <div>거래 내역이 없습니다</div>
        </div>`;
    }
    
    super.notifyHandlers();
  }

  isChecked = (transaction, incomeCheck, spendCheck) => {
    if(transaction.state === '수입' && incomeCheck) { 
      return true;
    } 
    if(transaction.state === '지출' && spendCheck) {
      return true;
    } 

    return false;
  }

  // 리스트에서 날짜가 달라지면 해당 날짜 출력
  listDateRender= (transaction, incomeCheck, spendCheck) => {
    let contents = '';
    // 이전날짜와 다른 날짜면 새로 하나 그린다.
    if(!this.isSameDate(transaction)) {
      contents = `
        <div class="transaction-date">
          <span class="transaction-date-date">${this.getToday(transaction)}</span>`;
      if(incomeCheck) {
        contents += ` <span class="transaction-date-income">${comma(this.dayTotal.get(transaction.date).income)}</span>`;
      }
      if(spendCheck) {
        contents += ` <span class="transaction-date-spend">${comma(this.dayTotal.get(transaction.date).spend)}</span>`;
      }
      contents += '</div>';
    }
    return contents;
  }

  // 리스트에서 날짜 변경 감지함
  isSameDate = (transaction) => {
    const curr = new Date(this.currDate);
    const newtime = new Date(transaction.date);
    if(curr.getFullYear() === newtime.getFullYear() 
      && curr.getMonth() === newtime.getMonth() 
      && curr.getDate() === newtime.getDate()) {
      return true;
    }
    
    this.currDate = transaction.date;
    return false;
  }

  getToday = (transaction) => {
    let date = '';
    if(transaction.length > 0) {
      date = new Date(transaction[0].date);
    }else{
      date = new Date(transaction.date);
    }
    const day = date.getDay();
    let yoil = '';
    switch(day) {
    case 0:
      yoil = '일';
      break;
    case 1:
      yoil = '월';
      break;
    case 2:
      yoil = '화';
      break;
    case 3:
      yoil = '수';
      break;
    case 4:
      yoil = '목';
      break;
    case 5:
      yoil = '금';
      break;
    case 6:
      yoil = '토';
      break;
    default:
      break;
    }
    const currDate = `${date.getMonth() + 1}월 ${date.getDate()}일 ${yoil}`;
    return currDate;
  }

  // eslint-disable-next-line consistent-return
  isIncome= (transaction) => {
    if(transaction.state === '수입') {
      return true;
    } 
    if(transaction.state === '지출') {
      return false;
    }
  }
}   
      
export default TransListView;