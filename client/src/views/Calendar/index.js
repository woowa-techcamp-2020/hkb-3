import TableView from './tableView';
import $ from '../../lib/miniJQuery';
import TotalView from '../Home/components/totalView';
import IncomeAndSpendView from './incomeAndSpendView';

class CalendarView {
  constructor(state) {
    this.state = state;
    this.data = state.data;
    this.wrap = $('.content-wrap').getNode();
    this.renderTotalViewWrap();
    new TotalView().render(this.data);
    this.addSelectHandler();
  }

  renderTotalViewWrap() {
    this.wrap.innerHTML = `
      <div class="transaction-total js-transaction-total">
      </div>
      <div class='calendar-wrap'>
      </div>
    `;
  }

  addSelectHandler() {
    $('.transaction-total-income').click(() => {
      this.render(this.state);
    });

    $('.transaction-total-spend').click(() => {
      this.render(this.state);
    });
  }



  
  render() {
    new TableView().render(this.state.date);
    if(this.data) {
      new IncomeAndSpendView().render(this.data);
    }
  }
}
  
export default CalendarView;