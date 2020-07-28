import express from 'express';
import userRepo from '../repository/userRepository';

const router = express.Router();

/* GET users listing. */
router.get('/users', async (req, res, next) => {
  const result = await userRepo.getAllUsers();
  console.log('hello', result);
  res.json({ status: 'ok', message: '유저받아라', data: result });
});


export default router;
