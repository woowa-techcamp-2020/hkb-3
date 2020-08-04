import moment from 'moment';
import Api from '../../api/index';
import TransListView from './components/transListView'; 
import TotalView from './components/totalView';
import InputFieldView from './components/inputFieldView';
import validation from '../../lib/validation';

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
    this.month = new Map();
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
    this.addEventToInput();
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
      let contents = document.querySelector('.transaction-input-contents-input').value;
      contents = contents.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const trans = {
        contents,
        category_id: document.querySelector('.transaction-input-category-select').value,
        user_id: 1,
        payment_id: document.querySelector('.transaction-input-method-select').value,
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
      document.querySelector('.transaction-input-category-select').value = '';
      document.querySelector('.transaction-input-contents-input').value = '';
      document.querySelector('.transaction-input-method-select').value = '';
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

      if(state === 2) {
        category = 1;
      }else{
        category = Math.floor(Math.random() * 7) + 2;
      }

      document.querySelector('.transaction-input-category-select').value = category;
      document.querySelector('.transaction-input-contents-input').value = '';
      document.querySelector('.transaction-input-method-select').value = Math.floor(Math.random() * 3) + 1;

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
    const that = this;
    const incomeCheckbox = document.querySelector('.transaction-total-income').children[0];
    incomeCheckbox.addEventListener('click', () => {
      this.incomeCheck = incomeCheckbox.checked;
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }

  // 지출 체크박스 이벤트 추가
  addSpendCheckboxEvent = () => {
    const that = this;
    const spendCheckbox = document.querySelector('.transaction-total-spend').children[0];
    spendCheckbox.addEventListener('click', () => {
      this.spendCheck = spendCheckbox.checked;
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }

  addEventToInput=() => {
    this.addDateInputEvent();
  }

  addDateInputEvent=() => {
    const dateInput = document.querySelector('.transaction-input-date-input');
    dateInput.addEventListener('input', () => {
      if(!validation.validateDate(dateInput.value.substring(
        dateInput.value.length - 1, dateInput.value.length,
      ))) {
        dateInput.value = dateInput.value.substring(0, dateInput.value.length - 1);
      } 

      dateInput.value = this.numberCheck(dateInput.value);
    });

    dateInput.addEventListener('focusout', () => {
      let tempInput = dateInput.value;
      tempInput = tempInput.replace(/-/g, '');

      if(tempInput.length === 7 && tempInput.substr(6, 1) !== 0) {
        dateInput.value = `${tempInput.substr(0, 4)}-${tempInput.substr(4, 2)}-0${tempInput.substr(6)}`;
      }
    });
  }

  numberCheck= (dateInput) => {
    this.month.set(1, 31);
    this.month.set(2, 28);
    this.month.set(3, 31);
    this.month.set(4, 30);
    this.month.set(5, 31);
    this.month.set(6, 30);
    this.month.set(7, 31);
    this.month.set(8, 31);
    this.month.set(9, 30);
    this.month.set(10, 31);
    this.month.set(12, 31);
    
    let tempDate = dateInput;
    tempDate = tempDate.replace(/-/g, '');
    const currDate = new Date();
    const currFullYear = currDate.getFullYear();
    let currMonth = currDate.getMonth() + 1;
    if(currMonth < 10) {
      currMonth = `0${currMonth}`;
    }
    let currDay = currDate.getDate();
    if(currDay < 10) {
      currDay = `0${currDay}`;
    }

    if(tempDate.length === 4) {
      if(tempDate > currFullYear) {
        tempDate = currFullYear;
      }
      if(tempDate === '0000') {
        tempDate = '1901';
      }
    }else if(tempDate.length > 4 && tempDate.length <= 6) {
      if(tempDate.substr(4) > Number(currMonth)) {
        tempDate = `${tempDate.substr(0, 4)}-${currMonth}`;
      }else{
        let month = tempDate.substr(4);
        if(month > 12) {
          month = 12;
        }
        if(month === '00') {
          month = '01';
        }
        tempDate = `${tempDate.substr(0, 4)}-${month}`;
      }
    }else if(tempDate.length > 6) {
      if(tempDate.substr(6) > Number(currDay)) {
        tempDate = `${tempDate.substr(0, 4)}-${tempDate.substr(4, 2)}-${currDay}`;
      }else{
        let day = tempDate.substr(6);
        if(day > this.month.get(Number(tempDate.substr(4, 2)))) {
          day = this.month.get(Number(tempDate.substr(4, 2)));
        }
        if(day === '00') {
          day = '01';
        }
        tempDate = `${tempDate.substr(0, 4)}-${tempDate.substr(4, 2)}-${day}`;
      }
    }
    return tempDate;
  }
}

export default HomeView;