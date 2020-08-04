import express from 'express';
import userRouter from './user';
import loginRouter from './login';
import transactionRouter from './transaction';
import categoryRouter from './category';

const router = express.Router();

router.use('/api', userRouter);
router.use('/api', transactionRouter);
router.use('/api', categoryRouter);

router.use('/auth', loginRouter);


/* GET home page. */

export default router;
