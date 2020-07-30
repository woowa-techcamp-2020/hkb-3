import { elements } from '../common';

class CalendarView {
  constructor(data) {
    this.data = data;
  }

  render = () => {
    elements.contentWrap.innerHTML = '<h1>CalenddarView</h1>';
  }
}
  
export default CalendarView;