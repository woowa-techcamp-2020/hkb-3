import TableView from './tableView';

class CalendarView {
  constructor(data) {
    this.data = data;
    this.wrap = document.querySelector('.content-wrap');
    this.tableView = new TableView();
  }
  
  render() {
    this.tableView.render();
  }
}
  
export default CalendarView;