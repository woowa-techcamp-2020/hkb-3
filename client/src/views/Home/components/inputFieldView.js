import View from '../../view';
import API from '../../../api/index';

class InputFieldView extends View {
  constructor(...args) {
    super(args);
    this.isModify = false;
  }
  
  setWrap() {
    this.wrap = document.querySelector('.transaction-input');
  }

  getCategory = async (state) => {
    const result = await API.Category().getCategoryByState(state);
    return result.data;
  }
  
  async render(params) {
    const { isModify } = params;
    const { state } = params;

    const categoryList = await this.getCategory(state);
    this.setWrap();
    const contents = `
      <div class="transaction-input-state">
        <span class="transaction-input-state-text">분류</span>
        <input type="radio" name="state" value="income" ${state === 'income' ? 'checked' : ''}>수입
        <input type="radio" name="state" value="spend" ${state === 'spend' ? 'checked' : ''}>지출
      </div> 
      <div class="transaction-input-date">
        <span class="transaction-input-date-text">날짜</span>
        <input type="text" class="transaction-input-date-input" placeholder="yyyy-mm-dd" maxlength="10"></input>
      </div>
      <div class="transaction-input-category">
        <span class="transaction-input-category-text">카테고리</span>
        <select class="transaction-input-category-select" name="category">
          ${categoryList.map((category) => `
            ${category.state === state ? `
              <option value="${category.id}">${category.name}</option>
            ` : ''}
          `).join('')}
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
      ${isModify ? `
        <button class="transaction-input-button-modify">수정</button>
        <button class="transaction-input-button-cancel">취소</button>
        <button class="transaction-input-button-delete">내역 삭제</button>
      ` : `
        <button class="transaction-input-button-confirm">거래 내역 추가</button>
        <button class="transaction-input-button-clear">내용 지우기</button>
      `}
        
        <button class="transaction-input-button-test">내역 자동 생성</button>
      </div>`;
    this.wrap.innerHTML = contents;
    super.notifyHandlers();
  }

  async renderCategory(state) {
    this.wrap = document.querySelector('.transaction-input-category');
    const categoryList = await this.getCategory(state);
    const contents = `
      <span class="transaction-input-category-text">카테고리</span>
      <select class="transaction-input-category-select" name="category">
        ${categoryList.map((category) => `
          ${category.state === state ? `
            <option value="${category.id}">${category.name}</option>
          ` : ''}
        `).join('')}
      </select>
    `;
    this.wrap.innerHTML = contents;
    super.notifyHandlers();
  }
}   
      
export default InputFieldView;