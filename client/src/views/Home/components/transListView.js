/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import moment from 'moment';
import View from '../../view';
import comma from '../../../lib/numberComma';
import API from '../../../api/index';
import $ from '../../../lib/miniJQuery';

const SELECTOR_TRANSACTION_CONTENTS = '.js-transaction-contents';
const CLASS_TRANSACTION_CONTENTS = 'js-transaction-contents';

const SELECTOR_TRANSACTION_INPUT_STATE = '.js-transaction-input-state';
const SELECTOR_TRANSACTION_INPUT_DATE_INPUT = '.js-transaction-input-date__input';

const SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME = '.js-transaction-input-state__radio-income';
const SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND = '.js-transaction-input-state__radio-spend';

const SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT = '.js-transaction-input-category__select';
const SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT = '.js-transaction-input-payment__select';
const SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT = '.js-transaction-input-amount__input';
const SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT = '.js-transaction-input-contents__input';

const SELECTOR_TRANSACTION_TOTAL_INCOME_CHECKBOX = '.js-transaction-total-income__checkbox';
const SELECTOR_TRANSACTION_TOTAL_SPEND_CHECKBOX = '.js-transaction-total-spend__checkbox';

const IMAGE_TRANSACTION_EMPTY = 'https://i.imgur.com/t0Lantl.png';
  
// const IMAGE_TRANSACTION_EMPTY = '';
const SELECTOR_SELECTED_TRANSACTION = '.js-selected-transaction';
const CLASS_SELECTED_TRANSACTION = 'js-selected-transaction';

const CATEGORY_ICONS = ['', 'fas fa-won-sign', 'fas fa-subway', 
  'fas fa-utensils', 'fas fa-subway', 'fas fa-shopping-bag', 
  'fas fa-hospital', 'fas fa-music', 'fas fa-ellipsis-h', 
  'fas fa-hand-holding-usd', 'fas fa-search-dollar'];

const incomeIconColor = '#9a9cea';
const spendIconColor = 'rgb(212, 108, 108)';
const incomeTextColor = '#a8aaf0';
const spendTextColor = 'rgb(207, 124, 124)';

class TransListView extends View {
  constructor(...args) {
    super(args);
    [this.inputFieldView] = args;
    this.state = [];
    this.dayIncome = 0;
    this.daySpend = 0;
    this.currDate = '';
    this.currEndDate = '';
    this.incomeCheck = true;
    this.spendCheck = true;
    this.dayTotal = new Map();
  }
  
  setWrap() {
    this.wrap = document.querySelector('.transaction-list');
  }

  // eslint-disable-next-line consistent-return
  calcDayTotal=(state) => {
    this.dayTotal = new Map();
    if(state === undefined || state.length <= 0) return null;
    
    state.forEach((transaction) => {
      let income = 0;
      let spend = 0;

      if(transaction.state === 'spend') {
        spend += transaction.amount;
      }
      if(transaction.state === 'income') {
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
      }
    });
  }
  
  render(state) {
    const { incomeCheck } = this;
    const { spendCheck } = this;
    
    this.state = state;
    this.calcDayTotal(state);
    this.setWrap();
    if(state !== undefined && (incomeCheck || spendCheck)) {
      this.wrap.innerHTML = `
        ${state.map((transaction) => `
          ${this.isChecked(transaction, incomeCheck, spendCheck) ? `
            ${this.listDateRender(transaction, incomeCheck, spendCheck)}
            <div class="transaction-contents js-transaction-contents ${transaction.id}">
              <span class="transaction-contents__category-${transaction.state}">
                <span class="category_icon" style="color:${this.isIncome(transaction) ? `${incomeIconColor}` : `${spendIconColor}`}">
                  <i class= "${CATEGORY_ICONS[transaction.category_id]}" ></i>
                </span>
                <span class="category_name">
                  ${transaction.category_name}
                </span>
              </span>
              <span class="transaction-contents__contents">${transaction.contents}</span>
              <span class="transaction-contents__payment">${transaction.payment_method}</span>
              <span class="transaction-contents__amount-${transaction.state}">
                ${this.isIncome(transaction) ? `+${comma(transaction.amount)}` : `-${comma(transaction.amount)}`} 원
              </span>
            </div>
          ` : ''}
        `).join('')}
      `;
    }else{
      this.wrap.innerHTML = `
        <div class="transaction-contents-none">
            <img src="${IMAGE_TRANSACTION_EMPTY}" width="200">
            <div>거래 내역이 없습니다</div>
        </div>`;
    }
    super.notifyHandlers();
  }

  addTransViewListenser() {
    this.addEventToCheckbox();
    this.addEventToTransaction();
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
      this.currDate = '';
      this.render(this.state);
      this.addEventToTransaction();
    });
  }

  // 지출 체크박스 이벤트 추가
  addSpendCheckboxEvent = () => {
    const spendCheckbox = document.querySelector(SELECTOR_TRANSACTION_TOTAL_SPEND_CHECKBOX);
    spendCheckbox.addEventListener('click', () => {
      this.spendCheck = spendCheckbox.checked;
      this.currDate = '';
      this.render(this.state);
      this.addEventToTransaction();
    });
  }

  

  // 거래내역 클릭할 때 이벤트 발생 -> 수정용
  addEventToTransaction = () => {
    document.body.addEventListener('click', async(e) => {
      // 지금 찍은애가 거래 내역이면
      if(e.target.classList[1] === CLASS_TRANSACTION_CONTENTS) {
        // 얘 정보 불러와
        const transId = e.target.classList[2];
        const transaction = await API.Transaction().getTransactionById(transId);

        // 기존에 찍어놓은 거래 내역이 있나?
        const selectedTransaction = document.querySelector(SELECTOR_SELECTED_TRANSACTION);

        // 기존에 찍은 거래 내역이 있으면(수정중이니까 이미 불러와있음) 일단 지워
        if(selectedTransaction !== null) {
          selectedTransaction.classList.remove(CLASS_SELECTED_TRANSACTION);
        }
        // 선택된 거래 내역이 없으면(수정중이 아니면) 수정용으로 카테고리랑 버튼 수정
        if(selectedTransaction === null) {
          this.inputFieldView.renderButton(true);
          this.inputFieldView.addEventToButtons(true);
        }
        await this.inputFieldView.renderCategory(transaction.data[0].state);

        // 인풋창들 거래 내역 찍은애 정보로 채운다.
        if(transaction.data[0].state === 'income') {
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = true;
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = false;
        }
        if(transaction.data[0].state === 'spend') {
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = false;
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = true;
        }
        
        const transDate = new Date(transaction.data[0].date);
        let currMonth = transDate.getMonth() + 1;
        if(currMonth < 10) {
          currMonth = `0${currMonth}`;
        }
        let currDate = transDate.getDate();
        if(currDate < 10) {
          currDate = `0${currDate}`;
        }
        document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value = `${transDate.getFullYear()}-${currMonth}-${currDate}`;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value = transaction.data[0].category_id;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value = transaction.data[0].payment_id;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value = transaction.data[0].amount;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value = transaction.data[0].contents;
        e.target.classList.add(CLASS_SELECTED_TRANSACTION);
      } else{
        this.inputFieldView.renderButton(false);
        this.inputFieldView.addEventToButtons(false);
        await this.inputFieldView.renderCategory('income');
        // 기존에 찍어놓은 거래 내역이 있나?
        const selectedTransaction = document.querySelector(SELECTOR_SELECTED_TRANSACTION);

        // 기존에 찍은 거래 내역이 있으면(수정중이니까 이미 불러와있음) 일단 지워
        if(selectedTransaction !== null) {
          selectedTransaction.classList.remove(CLASS_SELECTED_TRANSACTION);
        }

        console.log('다른거 찍었으니까 버튼 다시 그령 ');
      }
    }); 
    /*
    const list = document.querySelectorAll(SELECTOR_TRANSACTION_CONTENTS);
    list.forEach((div) => {
      div.addEventListener('click', async () => {
        const transId = div.className.split(' ')[2];
        
        const transaction = await API.Transaction().getTransactionById(transId);

        if(transaction.data[0].state === 'income') {
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = true;
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = false;
        }
        if(transaction.data[0].state === 'spend') {
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_INCOME).checked = false;
          document.querySelector(SELECTOR_TRANSACTION_INPUT_STATE_RADIO_SPEND).checked = true;
        }
        
        const inputFieldParmas = {
          state: transaction.data[0].state, isModify: true,
        };


        const selectedTransaction = document.querySelector(SELECTOR_SELECTED_TRANSACTION);

        if(selectedTransaction === null) {
          this.inputFieldView.renderButton(true);
          this.inputFieldView.addEventToButtons(true);
          // await this.inputFieldView.render(inputFieldParmas);
        }else{
          selectedTransaction.classList.remove(CLASS_SELECTED_TRANSACTION);
          await this.inputFieldView.renderCategory(transaction.data[0].state);
        }
        const transDate = new Date(transaction.data[0].date);
        let currMonth = transDate.getMonth() + 1;
        if(currMonth < 10) {
          currMonth = `0${currMonth}`;
        }
        let currDate = transDate.getDate();
        if(currDate < 10) {
          currDate = `0${currDate}`;
        }
        document.querySelector(SELECTOR_TRANSACTION_INPUT_DATE_INPUT).value = `${transDate.getFullYear()}-${currMonth}-${currDate}`;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_CATEGORY_SELECT).value = transaction.data[0].category_id;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_PAYMENT_SELECT).value = transaction.data[0].payment_id;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_AMOUNT_INPUT).value = transaction.data[0].amount;
        document.querySelector(SELECTOR_TRANSACTION_INPUT_CONTENTS_INPUT).value = transaction.data[0].contents;
        div.classList.add(CLASS_SELECTED_TRANSACTION);
      });
    });
    */
  }

  isChecked = (transaction, incomeCheck, spendCheck) => {
    if(transaction.state === 'income' && incomeCheck) { 
      return true;
    } 
    if(transaction.state === 'spend' && spendCheck) {
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
          <span class="transaction-date__date">${this.getToday(transaction)}</span>`;
      
      if(incomeCheck) {
        contents += ` <span class="transaction-date__income">+${comma(this.dayTotal.get(transaction.date).income)} 원</span>`;
      }
      if(spendCheck) {
        contents += ` <span class="transaction-date__spend">-${comma(this.dayTotal.get(transaction.date).spend)} 원</span>`;
      }
    }
    contents += '</div>';
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
    if(transaction.state === 'income') {
      return true;
    } 
    if(transaction.state === 'spend') {
      return false;
    }
  }
}   
      
export default TransListView;