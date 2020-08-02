class PieView {
  constructor(state) {
    this.categoryList = state.categoryList;
    this.colors = state.colors;
    this.circleRound = 565.49;
    this.radius = 90;
    this.mid = 300;
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

  getNextLineAndTextPos = (percent, x, weight) => {
    const stretch = 20;
    const textStretch = 30 * weight;
    if(percent >= 25 && percent < 75) {
      return { lineX: x - stretch, textX: x - stretch - textStretch };
    }
    return { lineX: x + stretch, textX: x + stretch };
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
      const weight = info.name.length;
      const { lineX, textX } = this.getNextLineAndTextPos(midPercent, x, weight);
      content += `
        <polyline points="${this.mid} ${this.mid}, ${x} ${y}, ${lineX} ${y}"/>
        <text x=${textX} y=${y}> 
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
    reversedList.reduce((prev, value) => {
      const newValue = value.percent + prev; 
      percentSumList.unshift({ 
        percentSum: newValue, 
        name: value.category_name, 
        percent: value.percent, 
      });
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
              class="pie" 
              stroke-dasharray="${this.getDistByRound(info.percentSum)} ${this.circleRound}" 
              stroke="${this.colors[i]}">
            </circle>
          `;
    });
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