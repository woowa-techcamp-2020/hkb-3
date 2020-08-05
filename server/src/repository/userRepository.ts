
import pool from '../config/database';
import userDTO from '../model/userDTO';

async function getAllUsers() {
  const result = await pool.query('select * from mydb.user');
  return result[0];
}

async function getUserById(id:Number) {
  const result = await pool.query(`select * from mydb.user where id=${id}`);
  return result[0];
}

async function getUserByEmail(email:string) {
  const result = await pool.query(`select * from mydb.user where email="${email}"`);
  return result[0];
}

async function deleteUser(id:Number) {
  const result = await pool.query(`delete from user where id= ${id}`);
  return result;
}
async function createUser(user:userDTO) {
  const result = await pool.query(`create from user where id= ${user.getId()}`);
  return result;
}



export default {
  getAllUsers, getUserById, getUserByEmail, deleteUser, createUser, 
};