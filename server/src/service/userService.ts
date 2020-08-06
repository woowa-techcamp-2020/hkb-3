import SocialUserDTO from 'src/model/socialUserDTO';
import { use } from 'passport';
import userDTO from '../model/userDTO';
import userRepo from '../repository/userRepository';

async function createUser(user:userDTO) {
  const result = userRepo.createUser(user);
  return result;
}

async function getAllUsers() {
  const result = await userRepo.getAllUsers();
  
  if(result.length > 0) {
    return { status: 'ok', message: '유저 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '유저없음' };
}
  
async function getUserById(id:Number) {
  const result = await userRepo.getUserById(id);
  if(result.length > 0) {
    return { status: 'ok', message: '유저 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '유저없음' };
}

async function getUserInfo(user:any) {
  if(user) {
    return {
      status: 'ok', id: user.id, email: user.email, name: user.name, 
    };
  }
  
  return { status: 'fail', message: '유저없음' };
}

async function getUserByEmail(email:string) {
  const result = await userRepo.getUserByEmail(email);
  if(result.length > 0) {
    return { status: 'ok', message: '유저 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '유저없음' };
}

async function getUserBySocialId(socialId:number) {
  const result = await userRepo.getUserBySocialID(socialId);
  if(result.length > 0) {
    return { status: 'ok', message: '유저 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '유저없음' };
}
  
async function deleteUser(id:Number) {
  const result = userRepo.deleteUser(id);
  return result;
}

async function createSocialUser(socialUser:SocialUserDTO) {
  const result = await userRepo.createSocialUser(socialUser);
  console.log('error?', result);
  return result;
}

export default {
  getAllUsers,
  getUserById,
  deleteUser, 
  createUser,
  getUserByEmail,
  getUserBySocialId,
  createSocialUser,
  getUserInfo,
};