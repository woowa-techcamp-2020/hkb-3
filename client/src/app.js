import './styles/container.scss';
import './styles/main.scss';
import 'core-js/modules/es.array.flat';
import Api from './api/index.js';

window.addEventListener('DOMContentLoaded', async () => {
  const userList = await Api.User().getAllUsers();
  const currUser = await Api.User().getUserById(1);
  console.log('hellO', userList);
});