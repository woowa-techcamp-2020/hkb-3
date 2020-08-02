import TableView from './tableView';
import { $, fillZeroToDate } from '../../common';

class CalendarView {
  constructor(data) {
    this.data = data;
    this.wrap = $('.content-wrap').getNode();
    this.tableView = new TableView();
    this.setYearAndMonth();
  }

  setYearAndMonth = (date = new Date()) => {
    const dataNode = $('.main-month').getNode();
    const fixMonth = 1;
    const month = fillZeroToDate((date.getMonth() + fixMonth).toString());

    dataNode.innerText = `${date.getFullYear()}.${month}`;
  }
  
  render(state) {
    this.tableView.render(state.date);
    this.setYearAndMonth(state.date);
  }
}
  
export default CalendarView;