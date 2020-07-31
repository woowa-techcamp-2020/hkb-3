import moment from 'moment';
import comma from '../../lib/numberComma';
import Api from '../../api/index';

class HomeView {
  constructor(model) {
    this.model = model;
    this.wrap = document.querySelector('.content-wrap');
    this.currDate = '';
  }

  render = (state) => {
    console.log('home', state);
    this.currDate = state[0].date;
    const transactionList = `
    <div class = "transaction-wrapper">
      <div class="transaction-input">
        <div class="transaction-input-state">
          <span class="transaction-input-state-text">분류</span>
            <input type="text" class="transaction-input-state-input"></input>
        </div>
        <div class="transaction-input-date">
          <span class="transaction-input-date-text">날짜</span>
          <input type="text" class="transaction-input-date-input"></input>
        </div>
        <div class="transaction-input-category">
          <span class="transaction-input-category-text">카테고리</span>
          <input type="text" class="transaction-input-category-input"></input>
        </div>
        <div class="transaction-input-method">
          <span class="transaction-input-method-text">결제수단</span>
          <input type="text" class="transaction-input-method-input"></input>
        </div>
        <div class="transaction-input-amount">
          <span class="transaction-input-amount-text">금액</span>
          <input type="number" class="transaction-input-amount-input"></input>
        </div>
        <div class="transaction-input-contents">
          <span class="transaction-input-contents-text">내용</span>
          <input type="text" class="transaction-input-contents-input"></input>
        </div>
        <div class="transaction-input-button">
          <button class="transaction-input-button-confirm">확인</button>
          <button class="transaction-input-button-clear">내용 지우기</button>
          <button class="transaction-input-button-test">내역 자동 생성</button>
        </div>
      </div>

      <div class="transaction-total">
        <div class="transaction-total-income">수입</div>
        <div class="transaction-total-expenditure">지출</div>
      </div>

      <div class ="transaction-list">
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
              ${this.isIncome(transaction) ? `+${comma(transaction.amount)}` : `-${comma(transaction.amount)}`}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
    `;
    this.wrap.innerHTML = transactionList;
    this.addEventToButtons();
  }

  addEventToButtons() {
    console.log('hello!!!! 실핸되네??');
    // 거래내역 추가하기 테스트 코드
    // const trans = {
    //   // id: 7,
    //   contents: '맥도날드',
    //   category_id: 3,
    //   user_id: 3,
    //   payment_id: 1,
    //   date: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
    //   amount: 6500,
    //   state: '지출',
    //   created_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
    //   updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
    // };
    // const result = await Api.Transaction().createTransaction(trans);
    const confirmButton = document.querySelector('.transaction-input-button-confirm');
    confirmButton.addEventListener('click', async () => {
      const trans = {
        contents: document.querySelector('.transaction-input-contents-input').value,
        category_id: document.querySelector('.transaction-input-category-input').value,
        user_id: 1,
        payment_id: document.querySelector('.transaction-input-method-input').value,
        date: new Date(moment(document.querySelector('.transaction-input-date-input').value).format('YYYY-MM-DD HH:mm:ss')),
        amount: document.querySelector('.transaction-input-amount-input').value,
        state: document.querySelector('.transaction-input-state-input').value,
        created_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
        updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
      };
      await Api.Transaction().createTransaction(trans);
      await this.model.fetchInitData();
      console.log('hihihihi', trans);
    });
    const clearButton = document.querySelector('.transaction-input-button-clear');
    clearButton.addEventListener('click', () => {
      document.querySelector('.transaction-input-state-input').value = '';
      document.querySelector('.transaction-input-amount-input').value = '';
      document.querySelector('.transaction-input-category-input').value = '';
      document.querySelector('.transaction-input-contents-input').value = '';
      document.querySelector('.transaction-input-method-input').value = '';
      document.querySelector('.transaction-input-date-input').value = '';
    });
    
    const states = ['수입', '지출'];
    
    const testButton = document.querySelector('.transaction-input-button-test');
    testButton.addEventListener('click', () => {
      const state = Math.floor(Math.random() * 2);
      document.querySelector('.transaction-input-state-input').value = states[state];
      document.querySelector('.transaction-input-amount-input').value = (Math.floor(Math.random() * 100) + 1) * 1000;
      let category = 1;

      if(state === 1) {
        category = 1;
      }else{
        category = Math.floor(Math.random() * 7) + 2;
      }

      document.querySelector('.transaction-input-category-input').value = category;
      document.querySelector('.transaction-input-contents-input').value = '';
      document.querySelector('.transaction-input-method-input').value = Math.floor(Math.random() * 3) + 1;
      document.querySelector('.transaction-input-date-input').value = `2020-07-${Math.floor(Math.random() * 10) + 21}`;
    });
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