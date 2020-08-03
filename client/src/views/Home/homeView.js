import moment from 'moment';
import Api from '../../api/index';
import TransListView from './components/transListView'; 
import TotalView from './components/totalView';
import InputFieldView from './components/inputFieldView';

class HomeView {
  constructor(model) {
    this.model = model;
    this.wrap = document.querySelector('.content-wrap');
    this.currDate = '';
    this.incomeCheck = true;
    this.spendCheck = true;
    this.transListView = new TransListView();
    this.totalView = new TotalView();
    this.inputFieldView = new InputFieldView();
  }

  // 화면 그리기
  render = (state) => {
    console.log('home', state);
    
    const contents = `
    <div class = "transaction-wrapper">
      <div class="transaction-input"></div>
      <div class= "transaction-total"></div>
      <div class= "transaction-list"></div>
    </div>
    `;
    this.wrap.innerHTML = contents;

    this.inputFieldView.render(state);
    this.totalView.render(state);    
    this.transListView.render(state, this.incomeCheck, this.spendCheck);

    this.addEventToCheckbox();
    this.addEventToButtons();
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