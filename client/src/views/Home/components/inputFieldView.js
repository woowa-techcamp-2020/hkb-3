import View from '../../view';

class InputFieldView extends View {
  constructor(...args) {
    super(args);
  }
  
  setWrap() {
    this.wrap = document.querySelector('.transaction-input');
  }
  
  render(state) {
    this.state = state;
    this.setWrap();
    const contents = `
      <div class="transaction-input-state">
        <span class="transaction-input-state-text">분류</span>
        <input type="radio" name="state" value="수입" checked>수입
        <input type="radio" name="state" value="지출">지출
      </div> 
      <div class="transaction-input-date">
        <span class="transaction-input-date-text">날짜</span>
        <input type="text" class="transaction-input-date-input"></input>
      </div>
      <div class="transaction-input-category">
        <span class="transaction-input-category-text">카테고리</span>
        <select class="transaction-input-category-select" name="category">
          <option value="1">월급</option>
          <option value="2">생활</option>
          <option value="3">식비</option>
          <option value="4">교통</option>
          <option value="5">쇼핑/뷰티</option>
          <option value="6">의료/건강</option>
          <option value="7">문화/여가</option>
          <option value="8">미분류</option>
        </select>
      </div>
      <div class="transaction-input-method">
        <span class="transaction-input-method-text">결제수단</span>
        <select class="transaction-input-method-select" name="category">
          <option value="1">현대카드</option>
          <option value="2">카카오체크카드</option>
          <option value="3">국민은행</option>
        </select>
      </div>
      <div class="transaction-input-amount">
        <span class="transaction-input-amount-text">금액</span>
        <input type="number" class="transaction-input-amount-input"></input>
      </div>
      <div class="transaction-input-contents">
        <span class="transaction-input-contents-text">내용</span>
        <input type="text" class="transaction-input-contents-input"></input>
      </div>
      <div class="transaction-input-button">
        <button class="transaction-input-button-confirm">확인</button>
        <button class="transaction-input-button-clear">내용 지우기</button>
        <button class="transaction-input-button-test">내역 자동 생성</button>
      </div>`;
    this.wrap.innerHTML = contents;
    super.notifyHandlers();
  }
}   
      
export default InputFieldView;