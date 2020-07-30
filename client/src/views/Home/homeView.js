import comma from '../../lib/numberComma';

class HomeView {
  constructor(data) {
    this.data = data;
    this.wrap = document.querySelector('.content-wrap');
    this.currDate = '';
  }

  render = (state) => {
    console.log('home', state);
    this.currDate = state[0].date;
    const transactionList = `
    <div class = "transaction-wrapper">
      <div class="transaction-date">
        <span class="today">${this.getToday(state)}</span>
      </div>

      ${state.map((transaction) => `

        ${this.isSameDate(transaction) ? '' : `
          <div class="transaction-date">
            ${this.getToday(transaction)}
          </div>`}

        <div class="transaction-contents ${transaction.id}">
          <span class="transaction-column-category-${this.isIncome(transaction) ? 'income' : 'expenditure'}">${transaction.category_name}</span>
          <span class="transaction-column-contents">${transaction.contents}</span>
          <span class="transaction-column-method">${transaction.payment_method}</span>
          <span class="transaction-column-amount-${this.isIncome(transaction) ? 'income' : 'expenditure'}">
            ${this.isIncome(transaction) ? comma(transaction.amount) : comma(transaction.amount * -1)}
          </span>
        </div>
      `).join('')}
    </div>
    `;
    this.wrap.innerHTML = transactionList;
  }

  getToday = (tranaction) => {
    let date = '';
    if(tranaction.length > 0) {
      date = new Date(tranaction[0].date);
    }else{
      date = new Date(tranaction.date);
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

  isSameDate = (tranaction) => {
    const curr = new Date(this.currDate);
    const newtime = new Date(tranaction.date);
    if(curr.getFullYear() === newtime.getFullYear() 
      && curr.getMonth() === newtime.getMonth() 
      && curr.getDate() === newtime.getDate()) {
      return true;
    }
    
    this.currDate = tranaction.date;
    return false;
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

export default HomeView;