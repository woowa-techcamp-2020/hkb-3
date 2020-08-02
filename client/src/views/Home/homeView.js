import moment from 'moment';
import comma from '../../lib/numberComma';
import Api from '../../api/index';
import TransListView from './components/transListView';

class HomeView {
  constructor(model) {
    this.model = model;
    this.wrap = document.querySelector('.content-wrap');
    this.currDate = '';
    this.incomeCheck = true;
    this.spendCheck = true;
    this.transListView = new TransListView();
  }

  // 인풋 창들
  inputFieldRender = () => {
    const contents = `
    <div class="transaction-input">
      <div class="transaction-input-state">
        <span class="transaction-input-state-text">분류</span>
        <input type="radio" name="state" value="수입" checked>수입
        <input type="radio" name="state" value="지출">지출
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
    </div>`;
    return contents;
  }

  // 화면 중간에 이번 달 총 수입, 총 지출 화면
  totalFieldRender = (totalInOut) => {
    const contents = `
    <div class="transaction-total">
      <div class="transaction-total-income">
        <input class="transaction-total-income-input" type="checkbox" checked=${this.incomeCheck}>
        <span>수입</span>
        <span>${comma(totalInOut.totalIncome)}</span>
        </div>
      <div class="transaction-total-spend">
        <input class="transaction-total-spend-input" type="checkbox" checked=${this.spendCheck}>
        <span>지출</span>
        <span>${comma(totalInOut.totalSpend)}</div></span>
    </div>`;
    return contents;
  }

  // 화면 그리기
  render = (state) => {
    console.log('home', state);
    const totalInOut = this.getTotalIncome(state);
    this.currDate = state[0].date;

    // ${this.listFieldRender(state)}
    const contents = `
    <div class = "transaction-wrapper">
      ${this.inputFieldRender()}
      ${this.totalFieldRender(totalInOut)}
      <div class ="transaction-list">
      </div>
    </div>
    `;
    this.wrap.innerHTML = contents;

    this.transListView.render(state, this.incomeCheck, this.spendCheck);
    this.addEventToCheckbox();
    this.addEventToButtons();
  }

  // 이번달 총 수입 구해서 리턴
  getTotalIncome = (state) => {
    let totalIncome = 0;
    let totalSpend = 0;
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

  // 버튼에 이벤트 리스너 추가하기
  addEventToButtons() {
    this.addConfirmButtonEvent();
    this.addClearButtonEvent();
    this.addTestButtonEvent();
  }

  addConfirmButtonEvent = () => {
    const confirmButton = document.querySelector('.transaction-input-button-confirm');
    confirmButton.addEventListener('click', async () => {
      const trans = {
        contents: document.querySelector('.transaction-input-contents-input').value,
        category_id: document.querySelector('.transaction-input-category-input').value,
        user_id: 1,
        payment_id: document.querySelector('.transaction-input-method-input').value,
        date: new Date(moment(document.querySelector('.transaction-input-date-input').value).format('YYYY-MM-DD HH:mm:ss')),
        amount: document.querySelector('.transaction-input-amount-input').value,
        state: document.querySelector('input[name="state"]:checked').value,
        created_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
        updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
      };
      await Api.Transaction().createTransaction(trans);
      await this.model.fetchInitData();
      this.transListView.render(this.model.data, this.incomeCheck, this.spendCheck);
    });
  }

  addClearButtonEvent= () => {
    const clearButton = document.querySelector('.transaction-input-button-clear');
    clearButton.addEventListener('click', () => {
      document.querySelector('.transaction-input-state-input').value = '';
      document.querySelector('.transaction-input-amount-input').value = '';
      document.querySelector('.transaction-input-category-input').value = '';
      document.querySelector('.transaction-input-contents-input').value = '';
      document.querySelector('.transaction-input-method-input').value = '';
      document.querySelector('.transaction-input-date-input').value = '';
    });
  }

  addTestButtonEvent = () => {
    const states = [true, false];
    
    const testButton = document.querySelector('.transaction-input-button-test');
    testButton.addEventListener('click', () => {
      const state = Math.floor(Math.random() * 2);
      
      document.querySelector('.transaction-input-state').children[1].checked = states[state];
      document.querySelector('.transaction-input-state').children[2].checked = !states[state];
      
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

  // 체크박스 이벤트 추가
  addEventToCheckbox = () => {
    this.addIncomeCheckboxEvent();
    this.addSpendCheckboxEvent();
  }

  // 수입 체크박스 이벤트 추가
  addIncomeCheckboxEvent = () => {
    const incomeCheckbox = document.querySelector('.transaction-total-income').children[0];
    incomeCheckbox.addEventListener('click', () => {
      this.incomeCheck = incomeCheckbox.checked;
      this.transListView.render(this.model.data, this.incomeCheck, this.spendCheck);
    });
  }

  // 지출 체크박스 이벤트 추가
  addSpendCheckboxEvent = () => {
    const spendCheckbox = document.querySelector('.transaction-total-spend').children[0];
    spendCheckbox.addEventListener('click', () => {
      this.spendCheck = spendCheckbox.checked;
      this.transListView.render(this.model.data, this.incomeCheck, this.spendCheck);
    });
  }
}

export default HomeView;