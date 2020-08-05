/* eslint-disable no-multi-spaces */
/* eslint-disable max-len */
import moment from 'moment';
import View from '../../view';
import API from '../../../api/index';
import { elements } from '../../../common';

import validation from '../../../lib/validation';

const SELECTOR_TRANSACTION_INPUT                    = '.js-transaction-input';
const SELECTOR_TRANSACTION_INPUT_STATE              = '.js-transaction-input-state';
const SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME = '.js-transaction-input-state__radio-income';
const SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND  = '.js-transaction-input-state__radio-spend';

const SELECTOR_TRANSACTION_INPUT_DATE       = '.js-transaction-input-date';
const SELECTOR_TRANSACTION_INPUT_DATE_INPUT = '.js-transaction-input-date__input';

const SELECTOR_TRANSACTION_INPUT_CATEGORY        = '.js-transaction-input-category';
const SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT = '.js-transaction-input-category__select';

const SELECTOR_TRANSACTION_INPUT_PAYMENT        = '.js-transaction-input-payment';
const SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT = '.js-transaction-input-payment__select';

const SELECTOR_TRANSACTION_INPUT_AMOUNT       = '.js-transaction-input-amount';
const SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT = '.js-transaction-input-amount__input';

const SELECTOR_TRANSACTION_INPUT_CONTENTS       = '.js-transaction-input-contents';
const SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT = '.js-transaction-input-contents__input';

const SELECTOR_TRANSACTION_INPUT_BUTTON         = '.js-transaction-input-button';
const SELECTOR_TRANSACTION_INPUT_BUTTON_CONFIRM = '.js-transaction-input-button__confirm';
const SELECTOR_TRANSACTION_INPUT_BUTTON_CLEAR   = '.js-transaction-input-button__clear';
const SELECTOR_TRANSACTION_INPUT_BUTTON_DELETE  = '.js-transaction-input-button__delete';
const SELECTOR_TRANSACTION_INPUT_BUTTON_MODIFY  = '.js-transaction-input-button__modify';
const SELECTOR_TRANSACTION_INPUT_BUTTON_CANCEL  = '.js-transaction-input-button__cancel';
const SELECTOR_TRANSACTION_INPUT_BUTTON_TEST    = '.js-transaction-input-button__test';

class InputFieldView extends View {
  constructor(...args) {
    super(args);
    this.isModify = false;
    this.month = new Map();
  }
  
  setWrap() {
    this.wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT);
  }

  getCategory = async (state) => {
    const result = await API.Category().getCategoryByState(state);
    return result.data;
  }
  
  async render(params) {
    const { isModify } = params;
    const { state } = params;

    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT);
    this.setWrap();
    const contents = `
      <div class="transaction-input-state    js-transaction-input-state"></div>
      <div class="transaction-input-date     js-transaction-input-date"></div>
      <div class="transaction-input-category js-transaction-input-category"></div>
      <div class="transaction-input-payment  js-transaction-input-payment"></div>
      <div class="transaction-input-amount   js-transaction-input-amount"></div>
      <div class="transaction-input-contents js-transaction-input-contents"></div>
      <div class="transaction-input-button   js-transaction-input-button"></div>`;
    wrap.innerHTML = contents;

    this.renderState(state);
    this.renderDate();
    this.renderCategory(state);
    this.renderPayment();
    this.renderAmount();
    this.renderContents();
    this.renderButton(isModify);
    
    super.notifyHandlers();
  }
  
  renderState = (state) => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE);
    const contents = `
      <span class="transaction-input-state__text">분류</span>
      <input type="radio" class="transaction-input-state__radio-income js-transaction-input-state__radio-income" name="state" value="income" ${state === 'income' ? 'checked' : ''}>수입
      <input type="radio" class="transaction-input-state__radio-spend js-transaction-input-state__radio-spend" name="state" value="spend" ${state === 'spend' ? 'checked' : ''}>지출
    `;
    // render
    wrap.innerHTML = contents;
    // add Event Listener
    this.addEventToRadio();
  }

  // state radio버튼에 이벤트 추가
  addEventToRadio = () => {
    this.addIncomeRadioEvent();
    this.addSpendRadioEvent();
  }

  // 수입 라디오 버튼
  addIncomeRadioEvent = () => {
    const incomeRadio = document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE).children[1];
    incomeRadio.addEventListener('click', () => {
      const state = incomeRadio.value;
      this.inputFieldView.renderCategory(state);
    });
  }

  // 지출 라디오 버튼 
  addSpendRadioEvent = () => {
    const spendRadio = document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE).children[2];
    spendRadio.addEventListener('click', () => {
      const state = spendRadio.value;
      this.inputFieldView.renderCategory(state);
    });
  }

  renderDate = () => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE);
    const contents = `
      <span class="transaction-input-date__text">날짜</span>
      <input type="text" class="transaction-input-date__input js-transaction-input-date__input" placeholder="yyyy-mm-dd" maxlength="10"></input>
    `;
    // render
    wrap.innerHTML = contents;
    // add Event Listener
    this.addDateInputEvent();
  }

  addDateInputEvent = () => {
    const dateInput = document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT);
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

  async renderCategory(state) {
    this.wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY);
    const categoryList = await this.getCategory(state);
    const contents = `
      <span class="transaction-input-category__text">카테고리</span>
      <select class="transaction-input-category__select js-transaction-input-category__select" name="category">
        ${categoryList.map((category) => `
          ${category.state === state ? `
            <option value="${category.id}">${category.name}</option>
          ` : ''}
        `).join('')}
      </select>
    `;
    this.wrap.innerHTML = contents;
  }

  //
  //
  // TODO : API 적용해서 가져와야합니다.
  //
  //

  renderPayment = () => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT);
    const contents = `
      <span class="transaction-input-payment__text">결제수단</span>
      <select class="transaction-input-payment__select js-transaction-input-payment__select" name="payment">
        <option value="1">현대카드</option>
        <option value="2">카카오체크카드</option>
        <option value="3">국민은행</option>
      </select>`;
    // render
    wrap.innerHTML = contents;
  }

  renderAmount = () => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT);
    const contents = `
      <span class="transaction-input-amount__text">금액</span>
      <input type="number" class="transaction-input-amount__input js-transaction-input-amount__input"></input>`;
    // render
    wrap.innerHTML = contents;
  }

  renderContents = () => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS);
    const contents = `
      <span class="transaction-input-contents__text">내용</span>
      <input type="text" class="transaction-input-contents__input js-transaction-input-contents__input"></input>`;
    // render
    wrap.innerHTML = contents;
  }

  renderButton = (isModify) => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON);
    const contents = `
        ${isModify ? `
          <button class="transaction-input-button__modify js-transaction-input-button__modify">수정</button>
          <button class="transaction-input-button__cancel js-transaction-input-button__calcel">취소</button>
          <button class="transaction-input-button__delete js-transaction-input-button__delete">내역 삭제</button>
        ` : `
          <button class="transaction-input-button__confirm js-transaction-input-button__confirm">거래 내역 추가</button>
          <button class="transaction-input-button__clear js-transaction-input-button__clear">내용 지우기</button>
        `}
        <button class="transaction-input-button__test js-transaction-input-button__test">내역 자동 생성</button>
      `;
    // render
    wrap.innerHTML = contents;
    // add Event Listener
    this.addEventToButtons();
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
    const confirmButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_CONFIRM);
    confirmButton.addEventListener('click', async () => {
      let contents = document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value;
      contents = contents.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const trans = {
        contents,
        category_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value,
        user_id: 1,
        payment_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value,
        date: new Date(moment(document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value).format('YYYY-MM-DD HH:mm:ss')).toISOString(),
        amount: document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value,
        created_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
        updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
      };
      await API.Transaction().createTransaction(trans);
      await elements.initModel.fetchInitData();
      this.transListView.render(this.model, this.incomeCheck, this.spendCheck);
    });
  }
 
  // 거래내역 지우기
  addClearButtonEvent= () => {
    const clearButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_CLEAR);
    clearButton.addEventListener('click', () => {
      document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = true;
      document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = false;
      document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value = '';
      document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value = 1;
      document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value = 1;
      document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value = '';
      document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value = '';
    });
  }

  // 거래내역 삭제 버튼 이벤트
  addDeleteButtonEvent = () => {
    const deleteButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_DELETE);
    deleteButton.addEventListener('click', async () => {
      await API.Transaction().deleteTransaction(this.currTransaction.id);
      await elements.initModel.fetchInitData();

      // 삭제 한 후 수정 상태 돌리기
      this.isModify = false;
      this.render('income', this.isModify);
    });
  }

  // 거래 내역 수정 버튼 이벤트
  addModifyButtonEvent = () => {
    const modifyButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_MODIFY);
    modifyButton.addEventListener('click', async () => {
      let contents = document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value;
      contents = contents.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const trans = {
        id: this.currTransaction.id,
        new_contents: contents,
        new_category_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value,
        new_payment_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value,
        new_date: new Date(moment(document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value).format('YYYY-MM-DD HH:mm:ss')).toISOString(),
        new_amount: document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value,
        updated_at: new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toISOString(),
      };

      await API.Transaction().updateTransaction(trans);
      await elements.initModel.fetchInitData();

      // 수정 한 후 수정 상태 돌리기
      this.isModify = false;
      this.render('income', this.isModify);
    });
  }

  // 거래 내역 수정 취소 버튼 이벤트
  addCancelButtonEvent = () => {
    const cancelButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_CANCEL);
    cancelButton.addEventListener('click', () => {
      this.isModify = false;
      this.render('income', this.isModify);
    });
  }

  // 거래 내역 자동 생성 버튼 테스트용
  addTestButtonEvent = () => {
    const states = ['income', 'spend'];
    
    const testButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_TEST);
    testButton.addEventListener('click', async () => {
      const state = Math.floor(Math.random() * 2);

      document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value = (Math.floor(Math.random() * 100) + 1) * 1000;
      
      if(state === 0) {
        document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = true;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = false;
      }else{
        document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = false;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = true;
      }
      
      document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value = '';
      document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value = Math.floor(Math.random() * 3) + 1;
      document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value = `2020-08-${Math.floor(Math.random() * 21) + 10}`;
      await this.renderCategory(states[state]);

      const cateList = await API.Category().getCategoryByState(states[state]);
      const cateIndex = Math.floor(Math.random() * cateList.data.length);
      document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value = cateList.data[cateIndex].id;
    });
  }
}   
      
export default InputFieldView;