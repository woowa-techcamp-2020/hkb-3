class StatisticsView {
  constructor(data) {
    this.data = data;
    this.wrap = document.querySelector('.content-wrap');
  }
  
    render = (state) => {
      console.log('statistics', state);
      this.wrap.innerHTML = '<h1>Statistics</h1>';
    }
}
  
export default StatisticsView;