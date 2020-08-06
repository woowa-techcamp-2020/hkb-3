import express from 'express';
import transactionService from '../service/transactionService';
import transactionRepo from '../repository/transactionRepository';
import TransactionDTO from '../model/transactionDTO';

const router = express.Router();

// 거래내역 검색 id
router.get('/transaction/:id', async (req, res, next) => {
  const result = await transactionService.getTransactionById(Number(req.params.id));
  // console.log('transactionRouter \n', result);
  res.json(result);
});

// 거래내역 검색 userId
router.get('/transaction/user/:userId', async (req, res, next) => {
  const result = await transactionService.getTransactionByUserId(Number(req.params.userId));
  // console.log('transactionRouter \n', result);
  res.json(result);
});

// 거래내역 검색 userId, date
router.get('/transaction/user/date/:query', async (req, res, next) => {
  const userId = req.params.query.split('&')[0];
  const date = req.params.query.split('&')[1];
  // const result = await transactionService.getTransactionByUserId(Number(req.params.userId));
  const result = await transactionService.getTransactionByUserIdAndDate(Number(userId), date);
  // console.log('transactionRouter \n', result);
  res.json(result);
});

// 거래내역 추가
router.post('/transaction', async (req, res, next) => {
  const transactionDTO = new TransactionDTO(req.body);
  const result = await transactionRepo.createTransaction(transactionDTO);
  res.json(result);
});

// 테스트 거래내역 추가
router.post('/transaction/test', async (req, res, next) => {
  const result = await transactionRepo.createTestTransaction(Number(req.body.userId));
  res.json(result);
});

// 거래내역 삭제
router.delete('/transaction/:id', async (req, res, next) => {
  const result = await transactionService.deleteTransaction(Number(req.params.id));
  res.json(result);
});

// 거래내역 수정
router.put('/transaction', async (req, res, next) => {
  const result = await transactionService.updateTransaction(req.body);
  res.json(result);
});

export default router;
