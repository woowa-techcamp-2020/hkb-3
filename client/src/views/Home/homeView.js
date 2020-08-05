import moment from 'moment';
import Api from '../../api/index';
import TransListView from './components/transListView'; 
import TotalView from './components/totalView';
import InputFieldView from './components/inputFieldView';
import validation from '../../lib/validation';
import { elements } from '../../common';

class HomeView {
  constructor(model) {
    this.model = model;
    this.wrap = document.querySelector('.content-wrap');
    this.currDate = '';
    this.incomeCheck = true;
    this.spendCheck = true;
    this.isModify = false;
    this.currTransaction = [];
    this.transListView = new TransListView();
    this.totalView = new TotalView();
    this.inputFieldView = new InputFieldView();
    this.month = new Map();
  }

  // 화면 그리기
  async render() {
    // console.log('home', this.model);
    const state = this.model;
    const contents = `
    <div class = "transaction-wrapper">
      <div class="transaction-input"></div>
      <div class= "transaction-total"></div>
      <div class= "transaction-list"></div>
    </div>
    `;
    this.wrap.innerHTML = contents;

    await this.inputFieldView.render({ state: 'income', isModify: this.isModify });
    this.totalView.render(state);    
    this.transListView.render(state, this.incomeCheck, this.spendCheck);

    this.addAllEvent();
  }

  addAllEvent() {
    this.addEventToTransaction();
    this.addEventToCheckbox();
    this.addEventToButtons();
    this.addEventToInput();
    this.addEventToRadio();
  }

  // 거래내역 클릭할 때 이벤트 발생 -> 수정용
  addEventToTransaction = () => {
    const list = document.querySelectorAll('.transaction-contents');
    list.forEach((div) => {
      div.addEventListener('click', async () => {
        if(this.isModify === false) {
          this.isModify = true;
        }
        const transId = div.className.split(' ')[1];
        const transaction = await Api.Transaction().getTransactionById(transId);
        
        if(transaction.data[0].state === 'income') {
          document.querySelector('.transaction-input-state').children[1].checked = true;
          document.querySelector('.transaction-input-state').children[2].checked = false;
        }
        if(transaction.data[0].state === 'spend') {
          document.querySelector('.transaction-input-state').children[1].checked = false;
          document.querySelector('.transaction-input-state').children[2].checked = true;
        }
        [this.currTransaction] = transaction.data;
        const inputFieldParmas = {
          state: transaction.data[0].state, isModify: this.isModify,
        };
        await this.inputFieldView.render(inputFieldParmas);
        this.addEventToButtons();
        this.addEventToInput();
        this.addEventToRadio();

        const transDate = new Date(transaction.data[0].date);
        let currMonth = transDate.getMonth() + 1;
        if(currMonth < 10) {
          currMonth = `0${currMonth}`;
        }
        let currDate = transDate.getDate();
        if(currDate < 10) {
          currDate = `0${currDate}`;
        }
        document.querySelector('.transaction-input-date-input').value = `${transDate.getFullYear()}-${currMonth}-${currDate}`;
        document.querySelector('.transaction-input-category-select').value = transaction.data[0].category_id;
        document.querySelector('.transaction-input-method-select').value = transaction.data[0].payment_id;
        document.querySelector('.transaction-input-amount-input').value = transaction.data[0].amount;
        document.querySelector('.transaction-input-contents-input').value = transaction.data[0].contents;
      });
    });
  }

  // 버튼에 이벤트 리스너 추가하기
  addEventToButtons() {
    this.addTestButtonEvent();
    if(this.isModify) {
      this.addDeleteButtonEvent();
      this.addModifyButtonEvent();
      this.addCancelButtonEvent();
    }else{
      this.addConfirmButtonEvent();
      this.addClearButtonEvent();
    }
  }

  // 거래내역 추가
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
        date: new Date(moment(document.querySelector('.transaction-input-date-input').value).format('YYYY-MM-DD HH:mm:ss')).toISOString(),
        amount: document.querySelector('.transaction-input-amount-input').value,
        created_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
        updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
      };
      await Api.Transaction().createTransaction(trans);
      await elements.initModel.fetchInitData();
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }
 
  // 거래내역 지우기
  addClearButtonEvent= () => {
    const clearButton = document.querySelector('.transaction-input-button-clear');
    clearButton.addEventListener('click', () => {
      document.querySelector('.transaction-input-state').children[1].checked = true;
      document.querySelector('.transaction-input-state').children[2].checked = false;
      document.querySelector('.transaction-input-date-input').value = '';
      document.querySelector('.transaction-input-category-select').value = 1;
      document.querySelector('.transaction-input-method-select').value = 1;
      document.querySelector('.transaction-input-amount-input').value = '';
      document.querySelector('.transaction-input-contents-input').value = '';
    });
  }

  // 거래내역 삭제 버튼 이벤트
  addDeleteButtonEvent = () => {
    const deleteButton = document.querySelector('.transaction-input-button-delete');
    deleteButton.addEventListener('click', async () => {
      await Api.Transaction().deleteTransaction(this.currTransaction.id);
      await elements.initModel.fetchInitData();

      // 삭제 한 후 수정 상태 돌리기
      this.isModify = false;
      this.resetInputFieldView('income', this.isModify);
    });
  }

  async resetInputFieldView(state, isModify) {
    await this.inputFieldView.render({ state, isModify });
    this.addEventToButtons();
    this.addEventToInput();
    this.addEventToRadio();
  }

  // 거래 내역 수정 버튼 이벤트
  addModifyButtonEvent = () => {
    const modifyButton = document.querySelector('.transaction-input-button-modify');
    modifyButton.addEventListener('click', async () => {
      let contents = document.querySelector('.transaction-input-contents-input').value;
      contents = contents.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const trans = {
        id: this.currTransaction.id,
        new_contents: contents,
        new_category_id: document.querySelector('.transaction-input-category-select').value,
        new_payment_id: document.querySelector('.transaction-input-method-select').value,
        new_date: new Date(moment(document.querySelector('.transaction-input-date-input').value).format('YYYY-MM-DD HH:mm:ss')).toISOString(),
        new_amount: document.querySelector('.transaction-input-amount-input').value,
        updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
      };

      await Api.Transaction().updateTransaction(trans);
      await elements.initModel.fetchInitData();

      // 수정 한 후 수정 상태 돌리기
      this.isModify = false;
      this.resetInputFieldView('income', this.isModify);
    });
  }

  // 거래 내역 수정 취소 버튼 이벤트
  addCancelButtonEvent = () => {
    const cancelButton = document.querySelector('.transaction-input-button-cancel');
    cancelButton.addEventListener('click', () => {
      this.isModify = false;
      this.resetInputFieldView('income', this.isModify);
    });
  }

  // 거래 내역 자동 생성 버튼 테스트용
  addTestButtonEvent = () => {
    const states = ['income', 'spend'];
    
    const testButton = document.querySelector('.transaction-input-button-test');
    testButton.addEventListener('click', async () => {
      const state = Math.floor(Math.random() * 2);

      document.querySelector('.transaction-input-amount-input').value = (Math.floor(Math.random() * 100) + 1) * 1000;

      
      if(state === 0) {
        document.querySelector('.transaction-input-state').children[1].checked = true;
        document.querySelector('.transaction-input-state').children[2].checked = false;
      }else{
        document.querySelector('.transaction-input-state').children[1].checked = false;
        document.querySelector('.transaction-input-state').children[2].checked = true;
      }
      
      document.querySelector('.transaction-input-contents-input').value = '';
      document.querySelector('.transaction-input-method-select').value = Math.floor(Math.random() * 3) + 1;
      document.querySelector('.transaction-input-date-input').value = `2020-08-${Math.floor(Math.random() * 21) + 10}`;
      await this.inputFieldView.renderCategory(states[state]);

      const cateList = await Api.Category().getCategoryByState(states[state]);
      const cateIndex = Math.floor(Math.random() * cateList.data.length);
      document.querySelector('.transaction-input-category-select').value = cateList.data[cateIndex].id;
    });
  }

  // 분류 radio버튼에 이벤트 추가
  addEventToRadio = () => {
    this.addIncomeRadioEvent();
    this.addSpendRadioEvent();
  }

  // 수입 라디오 버튼
  addIncomeRadioEvent = () => {
    const incomeRadio = document.querySelector('.transaction-input-state').children[1];
    incomeRadio.addEventListener('click', () => {
      const state = incomeRadio.value;
      this.inputFieldView.renderCategory(state);
    });
  }

  // 지출 라디오 버튼 
  addSpendRadioEvent = () => {
    const spendRadio = document.querySelector('.transaction-input-state').children[2];
    spendRadio.addEventListener('click', () => {
      const state = spendRadio.value;
      this.inputFieldView.renderCategory(state);
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
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }

  // 지출 체크박스 이벤트 추가
  addSpendCheckboxEvent = () => {
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