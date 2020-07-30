import moment from 'moment';
import transactionDTO from '../model/transactionDTO';
import transactionRepo from '../repository/transactionRepository';

async function createTransaction(transaction:transactionDTO) {
  const result = await transactionRepo.createTransaction(transaction);
  console.log('error?', result);
  return result;
}

async function getTransactionByUserId(id:number) {
  const result = await transactionRepo.getTransactionByUserId(id);
  
  if(result.length > 0) {
    return { status: 'ok', message: '내역 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '내역없음' };
}

async function updateTransaction(trans:transactionDTO) {
  const result = transactionRepo.updateTransaction(trans);
  return result;
}
  
async function deleteTransaction(id:Number) {
  const result = transactionRepo.deleteTransaction(id);
  return result;
}


export default {
  getTransactionByUserId, deleteTransaction, createTransaction, updateTransaction,
};