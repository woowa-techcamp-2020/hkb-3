class TableView {
  constructor() {
    this.wrap = document.querySelector('.content-wrap');
    this.rowCounts = 5;
    this.colCounts = 7;
  }

  buildContents = () => {
    let tableContents = '';
    for(let i = 0; i < this.rowCounts; i += 1) {
      tableContents += '<div class="date-grid">';
      for(let j = 0; j < this.colCounts; j += 1) {
        tableContents += '<div>1</div>';
      }
      tableContents += '</div>';
    }
    return tableContents;
  }

  render() {
    // eslint-disable-next-line no-undef
    const tableHtml = `
      <div class="calendar">
        <div class="day-of-week">
            <div class="sunday">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div class="saturday">토</div>
        </div>
        ${this.buildContents()}
      </div>
    `;
    this.wrap.innerHTML = tableHtml;
  }
}

export default TableView;