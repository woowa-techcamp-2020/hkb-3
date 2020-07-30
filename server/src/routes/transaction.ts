import express from 'express';
import transactionService from '../service/transactionService';
import transactionRepo from '../repository/transactionRepository';
import TransactionDTO from '../model/transactionDTO';

const router = express.Router();


router.get('/transaction/:userId', async (req, res, next) => {
  const result = await transactionService.getTransactionByUserId(Number(req.params.userId));
  // console.log('transactionRouter \n', result);
  res.json(result);
});

/* GET users listing. */
router.post('/transaction', async (req, res, next) => {
  const transactionDTO = new TransactionDTO(req.body);
  const result = await transactionRepo.createTransaction(transactionDTO);
  res.json(result);
});


export default router;
