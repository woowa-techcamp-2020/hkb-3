import express from 'express';
import userRouter from './user';
import loginRouter from './login';

const router = express.Router();

router.use('/api', userRouter);
router.use('/auth', loginRouter);

/* GET home page. */

export default router;
