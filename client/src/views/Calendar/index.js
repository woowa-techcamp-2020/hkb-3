import TableView from './tableView';
import { fillZeroToDate } from '../../common';
import $ from '../../lib/miniJQuery';

class CalendarView {
  constructor(data) {
    this.data = data;
    this.wrap = $('.content-wrap').getNode();
    this.tableView = new TableView();
  }
  
  render(state) {
    this.tableView.render(state.date);
  }
}
  
export default CalendarView;