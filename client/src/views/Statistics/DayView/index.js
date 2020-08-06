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
    this.heightPadding = 50;
    const defaultHeight = this.height - this.heightPadding;
    this.heightDiffer = 50;
    const xPadding = 20;
    const amountDiffer = this.maxSpend / (lineNumber - 1);
    let content = `<line x1="${this.defaultX}" y1="${defaultHeight}" x2="100%" y2="${defaultHeight}" />`;
    new Array(lineNumber).fill().reduce((prev, cur, i) => {
      const newHeight = prev - this.heightDiffer;
      let amount = 0;
      if(i !== 0) { 
        amount = Math.round(((this.maxSpend - (lineNumber - i - 1) * amountDiffer) / 10000)); 
      }
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
    this.differX = ((this.width - this.defaultX) / parseInt(lastDate));
    const heightPadding = 20;
    let content = '';
    new Array(dateNumber).fill().reduce((prev, cur, i) => {
      content += `
        <text x=${prev}, y=${this.height - heightPadding}>${this.month}.${1 + differDate * i}</text>
      `;
      return prev + (this.differX * differDate);
    }, this.defaultX);
    return content;
  }

  getListRemovedDateDuplicate() {
    const obj = {};
    this.state.data.forEach((payment) => {
      const paymentDate = new Date(payment.date);
      const key = paymentDate.getDate();
      if(obj[key]) {
        obj[key].amount += payment.amount;
      }else{
        obj[key] = { date: key, amount: payment.amount };
      }
    });
    const list = Object.values(obj);
    return list.sort((a, b) => a.date - b.date);
  }

  buildPointsLine() {
    const numberOfPadding = 3;
    const totalHeight = this.height - this.heightDiffer * numberOfPadding;
    let content = '';
    let points = '';
    const sortByDateList = this.getListRemovedDateDuplicate();


    sortByDateList.forEach((payment, i) => {
      const paymentDate = payment.date;
      const amountPercent = payment.amount / this.maxSpend;
      // eslint-disable-next-line max-len
      const heightAboutAmount = totalHeight - (totalHeight * amountPercent) + this.heightPadding;
      const widthAboutAmount = this.defaultX + this.differX * paymentDate;
      content += `
        <circle cx="${widthAboutAmount}" cy="${heightAboutAmount}" r="5"/>
      `;
      if(i === sortByDateList.length - 1) {
        points += `${widthAboutAmount} ${heightAboutAmount}`;
      }else{
        points += `${widthAboutAmount} ${heightAboutAmount}, `;
      }
    }, this);
    content = `
      <polyline points="${points}"/> 
      ${content}
    `;
    return content;
  }


  buildLineGraph() {
    const content = `
      <svg width="${this.width}px" height="${this.height}px">
        ${this.buildBasicLine()}
        ${this.buildDates()}
        ${this.buildPointsLine()}
      </svg>
    `;
    return content;
  }

  getMaxAmount() {
    let maxAmount = 0;
    console.log(this.getListRemovedDateDuplicate());
    this.getListRemovedDateDuplicate().forEach((payment) => {
      maxAmount = maxAmount > payment.amount ? maxAmount : payment.amount;
    });
    return maxAmount;
  }


  setMaxSpend() {
    const maxAmount = this.getMaxAmount();
    if(maxAmount < 100) {
      this.maxSpend = maxAmount;
    }
    const strMaxSpend = maxAmount.toString();
    const mid = 5;
    let strNewMaxSpend = '';
    let firstDigit = parseInt(strMaxSpend[0]);
    let secondDigit = parseInt(strMaxSpend[1]);

    if(secondDigit >= mid) {
      secondDigit = 0;
      firstDigit += 1;
    }else{
      secondDigit = mid;
    }
    strNewMaxSpend = `${firstDigit}${secondDigit}${'0'.repeat(strMaxSpend.length - 2)}`;

    this.maxSpend = parseInt(strNewMaxSpend);
  } 



  render = (state) => {
    this.state = state;
    console.log(state);
    this.setMaxSpend();
    this.state.wrap.innerHTML = `
        <div class="day-wrap">
          ${this.buildLineGraph()}
        </div>
    `;
  }
}

export default DayWarp;