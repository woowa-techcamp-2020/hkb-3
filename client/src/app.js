import './styles/container.scss';
import './styles/main.scss';
import './styles/calendar.scss';
import './styles/statistics.scss';
import './styles/home.scss';
import 'core-js/modules/es.array.flat';
import Api from './api/index.js';
import { renderByUrl, elements, renderByModel } from './common';



window.addEventListener('DOMContentLoaded', async () => {
  // 유저 목록 가져오기 테스트 코드
  const userList = await Api.User().getAllUsers();
  console.log('userList=', userList);


  // 거래내역 가져오기 테스트 코드
  const userId = 1;
  const payList = await Api.Transaction().getTransactionByUserId(userId);
  console.log('payList=', payList);
  
  // console.log('createTransaction result=', result);
  // console.log('currUser=', currUser);
});

(async () => {
  // init data 가져오면 각 모델에 데이터 추가 
  elements.initModel.addAllSubscribe(
    elements.homeModel,
    elements.calendarModel,
    elements.stastisticsModel,
  );

  // 라우팅시 화면 표시하도록 추가
  elements.routerModel.addSubscribe(renderByUrl);
  
  // 모델에 update 시 이를 바로 화면에 표시하도록 추가
  elements.homeModel.addSubscribe(renderByModel);
  elements.calendarModel.addSubscribe(renderByModel);
  elements.stastisticsModel.addSubscribe(renderByModel);

  // init data 가져오기
  await elements.initModel.fetchInitData();
  
  window.addEventListener('popstate', renderByUrl);
  document.querySelector('.main-router-wrap')
    .addEventListener('click', (e) => elements.routerModel.onLink(e));
})();