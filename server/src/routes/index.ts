import express from 'express';
import userRouter from './users';

const router = express.Router();

router.use('/', userRouter);
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

export default router;
