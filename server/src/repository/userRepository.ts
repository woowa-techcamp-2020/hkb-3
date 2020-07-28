
import pool from '../config/database';
import userDTO from '../model/userDTO';

async function getAllUsers() {
  const res = await pool.query('select * from mydb.user');
  console.log('결과', res[0]);
  return res[0];
}

async function getUserById(id:Number) {
  const res = await pool.query(`select * from mydb.user where id=${id}`);
  console.log('결과', res);
}

async function deleteUser(id:Number) {
  const res = await pool.query(`delete from user where id= ${id}`);
  console.log('result', res);
}
async function createUser(user:userDTO) {
  const res = await pool.query(`delete from user where id= ${user.getId()}`);
  
  console.log('result', res);
}

export default {
  getAllUsers, getUserById, deleteUser, createUser, 
};