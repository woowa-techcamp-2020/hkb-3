
import SocialUserDTO from 'src/model/socialUserDTO';
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
  const result = await pool.query('insert into user (name, email, password, created_at, updated_at) values (?, ?, ?, ?, ?)',
    [user.getName(), 
      user.getEmail(), 
      user.getPassword(),
      user.getCreatedAt(), 
      user.getUpdatedAt(),
    ]);
  return result;
}

async function createSocialUser(user:SocialUserDTO) {
  const result = await pool.query('insert into user (name, social_id, created_at, updated_at) values (?, ?, ?, ?)',
    [user.getName(), 
      user.getSocialId(), 
      user.getCreatedAt(), 
      user.getUpdatedAt(),
    ]);
  return result;
}

async function getUserBySocialID(socialId:number) {
  const result = await pool.query(`select * from mydb.user where social_id="${socialId}"`);
  return result[0];
}

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUser, 
  createUser,
  createSocialUser,
  getUserBySocialID,
};