import './styles/container.scss';
import './styles/main.scss';
import './styles/calendar.scss';
import './styles/statistics.scss';
// import './styles/home.scss';
import './styles/home-transaction-list.scss';
import './styles/home-transaction-input.scss';
import './styles/home-transaction-total.scss';
import 'core-js/modules/es.array.flat';
import Api from './api/index.js';
import { elements } from './common';
import Router from './controller/router';
import $ from './lib/miniJQuery';
import MainView from './views/Main';


const SELECTOR_HEADER_ROUTER_WRAP = '.js-header-router';

window.addEventListener('DOMContentLoaded', async () => {
  // 유저 목록 가져오기 테스트 코드
  const userList = await Api.User().getAllUsers();
  console.log('userList=', userList);
});

(async () => {
  // init data 가져오면 각 모델에 데이터 추가 
  const router = new Router();

  elements.initModel.addAllSubscribe(
    new MainView(),
    elements.homeModel,
    elements.calendarModel,
    elements.stastisticsModel,
  );

  // // 라우팅시 화면 표시하도록 추가
  // routerModel.addSubscribe((model) => routerModel.renderByUrl(model));
  
  // 모델에 update 시 이를 바로 화면에 표시하도록 추가
  elements.homeModel.addSubscribe((model) => router.renderByModel(model));
  elements.calendarModel.addSubscribe((model) => router.renderByModel(model));
  elements.stastisticsModel.addSubscribe((model) => router.renderByModel(model));

  // init data 가져오기
  await elements.initModel.fetchInitData();
  
  window.addEventListener('popstate', (state) => router.renderByUrl(state));
  document.querySelector(SELECTOR_HEADER_ROUTER_WRAP)
    .addEventListener('click', (e) => router.onLink(e));
})();