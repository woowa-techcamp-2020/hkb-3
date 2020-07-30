import { elements } from '../common';

class StatisticsView {
  constructor(data) {
    this.data = data;
  }
  
    render = (state) => {
      console.log('statistics', state);
      elements.contentWrap.innerHTML = '<h1>Statistics</h1>';
    }
}
  
export default StatisticsView;