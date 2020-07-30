import { elements } from '../common';

class StatisticsView {
  constructor(data) {
    this.data = data;
  }
  
    render = () => {
      elements.contentWrap.innerHTML = '<h1>Statistics</h1>';
    }
}
  
export default StatisticsView;