import TransListView from './components/transListView'; 
import TotalView from './components/totalView';
import InputFieldView from './components/inputFieldView';

const SELECTOR_CONTENT_WRAP = '.content-wrap';

class HomeView {
  constructor(model) {
    this.model = model;
    this.wrap = document.querySelector(SELECTOR_CONTENT_WRAP);
    this.totalView = new TotalView();
    this.inputFieldView = new InputFieldView();
    this.transListView = new TransListView(this.inputFieldView);
  }

  // 화면 그리기
  async render() {
    const state = this.model;
    const contents = `
    <div class= "transaction-wrapper">
      <div class= "transaction-total js-transaction-total"></div>
      <div class= "transaction-list js-transaction-list"></div>
      <div class= "transaction-input js-transaction-input"></div>
    </div>
    `;
    this.wrap.innerHTML = contents;

    this.totalView.render(state);
    this.transListView.render(state, true, true);
    await this.inputFieldView.render({ state: 'income', isModify: false });
  }
}

export default HomeView;