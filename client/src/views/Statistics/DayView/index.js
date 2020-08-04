class DayWarp {
  constructor() {
    this.width = 1200;
    this.height = 650;
    this.defaultX = 100;
  }

  getLastDate() {
    const { date } = this.state;
    const year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    return new Date(year, this.month, 0).getDate();
  }

  buildBasicLine = () => {
    const lineNumber = 11;
    const heightPadding = 50;
    const defaultHeight = this.height - heightPadding;
    const heightDiffer = 50;
    const digit = 10;
    const xPadding = 20;
    const maxSpend = this.getMaxSpend();
    let content = `<line x1="${this.defaultX}" y1="${defaultHeight}" x2="100%" y2="${defaultHeight}" />`;
    new Array(lineNumber).fill().reduce((prev, cur, i) => {
      const newHeight = prev - heightDiffer;
      let amount = 0;
      if(i !== 0) { amount = Math.round((maxSpend / (10000 * (lineNumber - i))) / digit) * digit; }
      content += `
        <line x1="${this.defaultX}" y1="${newHeight}" x2="100%" y2="${newHeight}" />
        <text x="${this.defaultX - xPadding}" y="${newHeight}" text-anchor="end">
          ${amount}${amount ? '만' : ''}
        </text>
      `;
      return newHeight;
    }, defaultHeight);
    return content;
  }

  buildDates() {
    const lastDate = this.getLastDate();
    const dateNumber = 6;
    const differDate = 5;
    const differX = ((this.width - this.defaultX) / parseInt(lastDate)) * differDate;
    const heightPadding = 20;
    let content = '';
    new Array(dateNumber).fill().reduce((prev, cur, i) => {
      content += `
        <text x=${prev}, y=${this.height - heightPadding}>${this.month}.${this.date + differDate * i}</text>
      `;
      return prev + differX;
    }, this.defaultX);
    return content;
  }


  buildLineGraph() {
    const content = `
      <svg width="${this.width}px" height="${this.height}px">
        ${this.buildBasicLine()}
        ${this.buildDates()}
      </svg>
    `;
    this.getMaxSpend();
    return content;
  }


  getMaxSpend() {
    const strTotalSpend = this.state.totalSpend.toString();
    const mid = 5;
    let strNewTotalSpend = '';
    let firstDigit = parseInt(strTotalSpend[0]);
    let secondDigit = parseInt(strTotalSpend[1]);

    if(secondDigit >= mid) {
      secondDigit = 0;
      firstDigit += 1;
    }else{
      secondDigit = mid;
    }
    strNewTotalSpend = `${firstDigit}${secondDigit}${'0'.repeat(strTotalSpend.length - 2)}`;

    return parseInt(strNewTotalSpend);
  } 



  render = (state) => {
    this.state = state;
    this.state.wrap.innerHTML = `
        <div class="day-wrap">
          <h1>Day Section</h1>
          ${this.buildLineGraph()}
        </div>
    `;
  }
}

export default DayWarp;