import Api from './api/index';
import 'core-js/stable';

console.log('start');
console.log('go');
window.addEventListener('DOMContentLoaded', async () => {
  const userList = await Api.User().getAllUsers();    
  console.log('hellO', userList); 
});