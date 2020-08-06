/* eslint-disable consistent-return */
/* eslint-disable no-multi-spaces */
/* eslint-disable max-len */
import moment from 'moment';
import View from '../../view';
import API from '../../../api/index';
import { elements } from '../../../common';
import comma from '../../../lib/numberComma';
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
const SELECTOR_TRANSACTION_INPUT_BUTTON_CONFIRM = '.js-transaction-input-button__confirm'; // 거래 내역 추가
const SELECTOR_TRANSACTION_INPUT_BUTTON_CLEAR   = '.js-transaction-input-button__clear';  // 내용 지우기
const SELECTOR_TRANSACTION_INPUT_BUTTON_DELETE  = '.js-transaction-input-button__delete'; // 내역 삭제
const SELECTOR_TRANSACTION_INPUT_BUTTON_MODIFY  = '.js-transaction-input-button__modify'; // 수정
const SELECTOR_TRANSACTION_INPUT_BUTTON_CANCEL  = '.js-transaction-input-button__cancel'; // 취소
const SELECTOR_TRANSACTION_INPUT_BUTTON_TEST    = '.js-transaction-input-button__test';  // 내역 자동 생성

const SELECTOR_SELECTED_TRANSACTION = '.js-selected-transaction';
const CLASS_SELECTED_TRANSACTION = 'js-selected-transaction';

const tempDate = new Date();
let tempMonth = (tempDate.getMonth() + 1);
if(tempMonth < 10) tempMonth = `0${tempMonth}`;
let tempDay = tempDate.getDate();
if(tempDay < 10) tempDay = `0${tempDay}`;

const CURR_DATE = `${tempDate.getFullYear()}-${tempMonth}-${tempDay}`;

class InputFieldView extends View {
  constructor(...args) {
    super(args);
    [this.model] = args;
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
    await this.renderCategory(state);
    this.renderPayment();
    this.renderAmount();
    this.renderContents();
    this.renderButton(isModify);
    
    super.notifyHandlers();
  }
  
  renderState = (state) => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE);
    const contents = `
      <div class="transaction-input-state__text">분류</div>
      <div class="transaction-input-state-radio-wrap">
        <label class="radio-color">
          <input type="radio" class="transaction-input-state__radio-income js-transaction-input-state__radio-income" 
                  name="state" value="income" ${state === 'income' ? 'checked' : ''}></input>
          <span class="transaction-input-state__radio-text">수입</span>
        </label>
        <label class="radio-color">
          <input type="radio" class="transaction-input-state__radio-spend js-transaction-input-state__radio-spend" 
                  name="state" value="spend" ${state === 'spend' ? 'checked' : ''}></input>
          <span class="transaction-input-state__radio-text">지출</span>
        </label>
      </div>
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
    const incomeRadio = document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME);
    incomeRadio.addEventListener('click', () => {
      const state = incomeRadio.value;
      this.renderCategory(state);
    });
  }

  // 지출 라디오 버튼 
  addSpendRadioEvent = () => {
    const spendRadio = document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND);
    spendRadio.addEventListener('click', () => {
      const state = spendRadio.value;
      this.renderCategory(state);
    });
  }


  // <input type="text" class="transaction-input-date__input js-transaction-input-date__input" placeholder="yyyy-mm-dd" maxlength="10"></input>
  renderDate = () => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE);
    const contents = `
      <div class="transaction-input-date__text">날짜</div>
      <input type="date" class="transaction-input-date__input js-transaction-input-date__input" min="1901-01-01" max=${CURR_DATE} value="${CURR_DATE}"></input>
    `;
    // render
    wrap.innerHTML = contents;
    // add Event Listener
    // this.addDateInputEvent();
  }


  addDateInputEvent = () => {
    const dateInput = document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT);
    dateInput.addEventListener('input', () => {
      let tempInput = dateInput.value;
      tempInput = tempInput.replace(/-/g, '');
      
      // 숫자 아니면 지워버령
      if(!validation.validateOnlyNumber(tempInput.substring(tempInput.length - 1, tempInput.length))) {
        dateInput.value = tempInput.substring(0, tempInput.length - 1);
      } 

      // 숫자면 날짜 포맷으로 변경
      dateInput.value = this.makeNumberToDateFormat(dateInput.value);
    });

    dateInput.addEventListener('focusout', () => {
      let tempInput = dateInput.value;
      tempInput = tempInput.replace(/-/g, '');

      if(tempInput.length === 7 && tempInput.substr(6, 1) !== 0) {
        dateInput.value = `${tempInput.substr(0, 4)}-${tempInput.substr(4, 2)}-0${tempInput.substr(6)}`;
      }
    });
  }

  renderCategory = async (state) => {
    this.wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY);
    const categoryList = await this.getCategory(state);
    const contents = `
      <div class="transaction-input-category__text">카테고리</div>
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
      <div class="transaction-input-payment__text">결제수단</div>
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
      <div class="transaction-input-amount__text">금액</div>
      <input type="text" class="transaction-input-amount__input js-transaction-input-amount__input" placeholder="금액을 입력해주세요" maxlength="10"></input>`;
    // render
    wrap.innerHTML = contents;
    this.addAmountInputEvent();
  }

  // 금액 입력 창
  addAmountInputEvent = () => {
    const amountInput = document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT);
    amountInput.addEventListener('input', () => {
      let inputValue = amountInput.value.split(',').join('');
      
      // 숫자 외 다른 문자 오면 지움
      if(!validation.validateOnlyNumber(inputValue.substring(
        inputValue.length - 1, inputValue.length,
      ))) {
        inputValue = inputValue.substring(0, inputValue.length - 1);
      }

      // 숫자가 0이면 지움
      if(Number(inputValue) === 0) {
        inputValue = inputValue.substring(0, inputValue.length - 1);
      }

      if(inputValue.length >= 4 && inputValue.length < 7) {
        inputValue = `${inputValue.substring(0, inputValue.length - 3)},${inputValue.substring(inputValue.length - 3, inputValue.length)}`;
      } else if(inputValue.length >= 7 && inputValue.length < 10) {
        inputValue = `${inputValue.substring(0, inputValue.length - 6)},${inputValue.substring(inputValue.length - 6, inputValue.length - 3)},${inputValue.substring(inputValue.length - 3, inputValue.length)}`;
      }else if(inputValue.length >= 10) {
        inputValue = `${inputValue.substring(0, inputValue.length - 9)},${inputValue.substring(inputValue.length - 9, inputValue.length - 6)},${inputValue.substring(inputValue.length -  6, inputValue.length - 3)},${inputValue.substring(inputValue.length - 3, inputValue.length)}`;
      }
      amountInput.value = inputValue;
    });
  }

  renderContents = () => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS);
    const contents = `
      <div class="transaction-input-contents__text">내용</div>
      <input type="text" class="transaction-input-contents__input js-transaction-input-contents__input" maxlength="15" placeholder="거래 내용을 입력해주세요"></input>`;
    // render
    wrap.innerHTML = contents;
  }

  renderButton = (isModify) => {
    const wrap = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON);
    const contents = `
        ${isModify ? `
          <button class="transaction-input-button__modify js-transaction-input-button__modify">수정</button>
          <button class="transaction-input-button__cancel js-transaction-input-button__cancel">취소</button>
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
    this.addEventToButtons(isModify);
  }

  // 버튼에 이벤트 리스너 추가하기
  addEventToButtons(isModify) {
    this.addTestButtonEvent();
    if(isModify) {
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
        user_id: elements.initModel.state.userInfo.id,
        payment_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value,
        date: moment(new Date(`${document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value} 00:00:00`)).format('YYYY-MM-DD HH:mm:ss'),
        amount: document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value.split(',').join(''),
        created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
      await API.Transaction().createTransaction(trans);
      await elements.initModel.fetchInitData();
    });
  }
 
  // 거래내역 지우기 clear
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
      const transId = document.querySelector(SELECTOR_SELECTED_TRANSACTION).className.split(' ')[2];
      await API.Transaction().deleteTransaction(transId);
      await elements.initModel.fetchInitData();

      // 삭제 한 후 수정 상태 돌리기
      this.render({ state: 'income', isModify: false });
    });
  }

  // 거래 내역 수정 버튼 이벤트
  addModifyButtonEvent = () => {
    const modifyButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_MODIFY);
    modifyButton.addEventListener('click', async () => {
      let contents = document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value;
      contents = contents.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const transId = document.querySelector(SELECTOR_SELECTED_TRANSACTION).className.split(' ')[2];
      const trans = {
        id: transId,
        new_contents: contents,
        new_category_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value,
        new_payment_id: document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value,
        new_date: moment(new Date(document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value)).format('YYYY-MM-DD HH:mm:ss'),
        new_amount: document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value.split(',').join(''),
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      await API.Transaction().updateTransaction(trans);
      await elements.initModel.fetchInitData();

      // 수정 한 후 수정 상태 돌리기
      this.render({ state: 'income', isModify: false });
    });
  }

  // 거래 내역 수정 취소 버튼 이벤트
  addCancelButtonEvent = () => {
    const cancelButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_CANCEL);
    cancelButton.addEventListener('click', () => {
      const selectedTransaction = document.querySelector(SELECTOR_SELECTED_TRANSACTION);
      if(selectedTransaction !== null) {
        selectedTransaction.classList.remove(CLASS_SELECTED_TRANSACTION);
      }
      this.render({ state: 'income', isModify: false });
    });
  }

  addTestButtonEvent = () => {
    const testButton = document.querySelector(SELECTOR_TRANSACTION_INPUT_BUTTON_TEST);
    testButton.addEventListener('click', async () => {
      const userId = elements.initModel.state.userInfo.id;
      const result = await API.Transaction().createTestTransaction(userId);
      await elements.initModel.fetchInitData();
      console.log(result);
    });
  }
  // 거래 내역 자동 생성 버튼 테스트용
  /*
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
  */
}   

      
export default InputFieldView;