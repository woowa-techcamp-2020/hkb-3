import './styles/container.scss';
import './styles/main.scss';
import 'core-js/modules/es.array.flat';
import Api from './api/index.js';
import { popStateHandler, elements } from './common';

window.addEventListener('DOMContentLoaded', async () => {
  const userList = await Api.User().getAllUsers();
  const currUser = await Api.User().getUserById(1);
  console.log('hellO', userList);
});


(function onRouter() {
  window.addEventListener('popstate', popStateHandler);
  elements.routerModel.addSubscribe(popStateHandler);
  popStateHandler({});
}());


document.querySelector('.main-router-wrap')
  .addEventListener('click', (e) => elements.routerModel.onLink(e));