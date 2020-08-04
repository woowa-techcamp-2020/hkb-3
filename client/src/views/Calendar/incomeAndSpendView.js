import { isIncome, getDateFromSqlDate, isSpend } from '../../common';
import $ from '../../lib/miniJQuery';
import numberComma from '../../lib/numberComma';

class IncomeAndSpendView {
  getAmountList(checkCondition) {
    const maxMonthDate = 31;
    const initValue = 0;
    const incomesInMonth = Array(maxMonthDate + 1).fill(initValue);
    this.data.forEach((info) => {
      if(checkCondition(info)) {
        const date = getDateFromSqlDate(info.date);
        incomesInMonth[date] += info.amount;
      }
    });
    return incomesInMonth;
  }

  renderIncome() {
    const incomes = this.getAmountList(isIncome);
    incomes.forEach((amount, idx) => {
      if(amount) {
        const cell = $(`.date ~ [data-date="${idx}"]`).getNode();
        cell.innerHTML += `
          <div class="amount-income">
            +${numberComma(`${amount}`)}
          </div>
        `;
      }
    });
  }

  renderSpend() {
    const spends = this.getAmountList(isSpend);
    spends.forEach((amount, idx) => {
      if(amount) {
        const cell = $(`.date ~ [data-date="${idx}"]`).getNode();
        cell.innerHTML += `
          <div class="amount-spend">
            -${numberComma(`${amount}`)}
          </div>
        `;
      }
    });
  }
  
  render(data) {
    this.data = data;
    const incomeInput = $('.transaction-total-income-input').getNode();
    const spendInput = $('.transaction-total-spend-input').getNode();
    if(incomeInput.checked) {
      this.renderIncome();
    }
    if(spendInput.checked) {
      this.renderSpend();
    }
  }
}
  
export default IncomeAndSpendView;