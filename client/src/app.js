import './styles/container.scss';
import './styles/main.scss';
import 'core-js/modules/es.array.flat';
import Api from './api/index.js';

console.log('start');
console.log('go');

window.addEventListener('DOMContentLoaded', async () => {
  const userList = await Api.User().getAllUsers();    
  console.log('hellO', userList);
});