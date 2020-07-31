import express from 'express';
import userRouter from './user';
import loginRouter from './login';
import transactionRouter from './transaction';

const router = express.Router();

router.use('/api', userRouter);
router.use('/api', transactionRouter);

router.use('/auth', loginRouter);


/* GET home page. */

export default router;
