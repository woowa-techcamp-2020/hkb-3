class PieView {
  constructor(state) {
    this.categoryList = state.categoryList;
    this.colors = state.colors;
    this.circleRound = 565.49;
    this.radius = 90;
    this.mid = 350;
    this.percentSumList = this.makePercentSumList();
  }

  degreeToRadian = (degree) => degree * (Math.PI / 180)

  getPosOnCircle(percent) {
    const stretch = 120;

    // 각도와 퍼센트의 비율
    const angRatio = 3.6;
    const newRadian = this.degreeToRadian((percent * angRatio));
    const x = Math.cos(newRadian) * (this.radius + stretch) + this.mid;
    const y = Math.sin(newRadian) * (this.radius + stretch) + this.mid;
    return { x, y };
  }

  isLeftSemicircle = (percent) => percent >= 25 && percent < 75

  getPosOptionsBySemicircle = (percent, x) => {
    const stretch = 20;
    if(this.isLeftSemicircle(percent)) {
      return { lineX: x - stretch, textX: x - stretch, textAnchorOption: 'end' };
    }
    return { lineX: x + stretch, textX: x + stretch, textAnchorOption: 'start' };
  }

  buildPath() {
    let content = '';
    this.percentSumList.forEach((info, i) => {
      let nextPercent;
      const curPercent = info.percentSum;
      if(i === this.percentSumList.length - 1) {
        nextPercent = 0;
      }else{
        nextPercent = this.percentSumList[i + 1].percentSum;
      }
      const midPercent = (curPercent + nextPercent) / 2;
      const { x, y } = this.getPosOnCircle(midPercent);
      const { lineX, textX, textAnchorOption } = this.getPosOptionsBySemicircle(midPercent, x);
      content += `
        <polyline points="${this.mid} ${this.mid}, ${x} ${y}, ${lineX} ${y}"/>
        <text x=${textX} y=${y} text-anchor="${textAnchorOption}"> 
          ${info.name} <tspan class="percent">${info.percent}%</tspan>
        </text>
      `;
    });
    return content;
  }
    
  getDistByRound(percent) {
    return this.circleRound * (percent / 100);
  }
    
  makePercentSumList() {
    const percentSumList = [];
    const reversedList = this.categoryList.slice();
    reversedList.reverse();
    reversedList.reduce((prev, payment) => {
      const newValue = payment.percent + prev; 
      // 퍼센트가 너무 작을때 예외처리
      if(payment.percent <= 2) {
        if(percentSumList.length === 0) {
          percentSumList.unshift({ 
            percentSum: newValue, 
            name: '기타', 
            percent: payment.percent, 
          });
        }else{
          percentSumList[0].percent += payment.percent;
          percentSumList[0].percentSum += payment.percent;
        }
      }else{
        percentSumList.unshift({ 
          percentSum: newValue, 
          name: payment.category_name, 
          percent: payment.percent, 
        });
      }
      
      return newValue;
    }, 0);
    
    // 100으로 그래프 채우면 1만큼 비기때문에 101로 바꿔준다.
    const errorValue = 1;
    percentSumList[0].percentSum += errorValue;
    return percentSumList;
  }
    
      
  buildCircle() {
    let content = '';
    this.percentSumList.forEach((info, i) => {
      content += `
            <circle 
              class="pie apeared-pie" 
              stroke-dasharray="${this.getDistByRound(info.percentSum)} ${this.circleRound}" 
              stroke="${this.colors[i]}">
            </circle>
          `;
    });
    content += `
      <circle 
        class="pie cover-pie" 
      >
      </circle>
    `;
    return content;
  }
    
  buildPi = () => {
    const content = `
    <div class="pi-wrap">
        <svg class="svg-wrap">
          ${this.buildPath()}
          <svg class="circle-wrap" >
          ${this.buildCircle()}
          </svg>
        </svg>
    </div>
    `;
    return content;
  }
}
  
export default PieView;