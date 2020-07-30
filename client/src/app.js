import './styles/container.scss';
import './styles/main.scss';
import './styles/calendar.scss';
import 'core-js/modules/es.array.flat';
import Api from './api/index.js';
import { popStateHandler, elements } from './common';

console.log('start');
console.log('go');

window.addEventListener('DOMContentLoaded', async () => {
  const userList = await Api.User().getAllUsers();    
  console.log('hellO', userList);
});


(function onRouter() {
  window.addEventListener('popstate', popStateHandler);
  elements.routerModel.addSubscribe(popStateHandler);
  popStateHandler({});
}());


document.querySelector('.main-router-wrap')
  .addEventListener('click', (e) => elements.routerModel.onLink(e));