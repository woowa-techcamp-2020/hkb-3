class TableView {
  constructor() {
    this.wrap = document.querySelector('.content-wrap');
    this.rowCounts = 5;
    this.colCounts = 7;
  }


  setDate(newDate) {
    // 요일
    this.day = newDate.getDay();
    this.month = newDate.getMonth();
    // 특정 날짜
    this.date = newDate.getDate();
    this.year = newDate.getFullYear();

    // 날짜
    const startDate = new Date(this.year, this.month);
    this.startDay = startDate.getDay();
    // 마지막 날짜
    this.lastDate = new Date(this.year, this.month + 1, 0).getDate();
    this.previousLastDate = new Date(this.year, this.month, 0).getDate();
  }

  setRowCount() {
    const totalDate = this.startDay + this.lastDate;
    const maxCellCounts = 7 * 5;
    if(totalDate > maxCellCounts) {
      this.rowCounts = 6;
    }else{
      this.rowCounts = 5;
    }
  }

  getClass = (idx, accessDateFlag) => {
    let classes = 'header';
    classes += !idx ? ' sunday' : '';
    classes += !accessDateFlag ? ' other-date' : ' date';
    return classes; 
  }

  buildContents = () => {
    let tableContents = '';
    let dateCount = -this.startDay;
    this.setRowCount();
    
    for(let i = 0; i < this.rowCounts; i++) {
      tableContents += '<div class="date-grid">';
      for(let j = 0; j < this.colCounts; j++) {
        let date = 0;
        let accessDateFlag = false;
        if(dateCount < 0) {
          date = this.previousLastDate + dateCount + 1;
        }else if(dateCount / this.lastDate < 1) {
          date = dateCount + 1;
          accessDateFlag = true;
        }else{
          date = (dateCount % this.lastDate) + 1;
        }
        tableContents += `
          <div class="day-wrap">
            <div class="${this.getClass(j, accessDateFlag)}">
              ${date}
            </div>
            <div data-date=${date}>
            </div>
          </div>
        `;
        dateCount++;
      }
      tableContents += '</div>';
    }
    return tableContents;
  }

  render(date) {
    this.setDate(date);

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
            <div>토</div>
        </div>
        ${this.buildContents()}
      </div>
    `;
    this.wrap.innerHTML = tableHtml;
  }
}

export default TableView;