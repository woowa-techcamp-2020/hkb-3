import TableView from './tableView';
import { fillZeroToDate } from '../../common';
import $ from '../../lib/miniJQuery';
import TotalView from '../Home/components/totalView';

class CalendarView {
  constructor(data) {
    this.data = data;
    this.wrap = $('.content-wrap').getNode();
    this.tableView = new TableView();
  }
  
  render(state) {
    this.tableView.render(state.date);
    new TotalView().render(state.data);
  }
}
  
export default CalendarView;