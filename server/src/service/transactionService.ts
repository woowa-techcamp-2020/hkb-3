import moment from 'moment';
import transactionRepo from '../repository/transactionRepository';
import TransactionDTO from '../model/transactionDTO';

async function createTransaction(transaction:TransactionDTO) {
  const result = await transactionRepo.createTransaction(transaction);
  console.log('error?', result);
  return result;
}

async function getTransactionById(id:number) {
  const result = await transactionRepo.getTransactionById(id);
  
  if(result.length > 0) {
    return { status: 'ok', message: '내역 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '내역없음' };
}

async function getTransactionByUserId(id:number) {
  const result = await transactionRepo.getTransactionByUserId(id);
  
  if(result.length > 0) {
    return { status: 'ok', message: '내역 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '내역없음' };
}

async function getTransactionByUserIdAndDate(id:number, date:string) {
  const result = await transactionRepo.getTransactionByUserIdAndDate(id, date);
  
  if(result.length > 0) {
    return { status: 'ok', message: '내역 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '내역없음' };
}

// eslint-disable-next-line consistent-return
async function updateTransaction(params:any) {
  const tempTransaction = await transactionRepo.getTransactionById(params.id);
  if (tempTransaction.length === 0) {
    return { result: 'fail', message: '존재하지 않는 내역입니다' };
  } 
  const transactionDTO = new TransactionDTO(tempTransaction[0]);
  transactionDTO.setUpdatedAt(params.updated_at);
  if(params.new_contents) transactionDTO.setContents(params.new_contents);
  if(params.new_amount) transactionDTO.setAmount(Number(params.new_amount));
  if(params.new_category_id) transactionDTO.setCategoryId(Number(params.new_category_id));
  if(params.new_payment_id) transactionDTO.setPaymentId(Number(params.new_payment_id));
  if(params.new_date) transactionDTO.setDate(params.new_date);
  
  const updateResult = await transactionRepo.updateTransaction(transactionDTO);
  
  const transaction = await transactionRepo.getTransactionById(transactionDTO.getId());
  return {
    result: 'ok',
    message: `${transactionDTO.getId()} 정보를 수정했습니다.`,
    data: transaction[0],
  };
}
  
async function deleteTransaction(id:Number) {
  const result = await transactionRepo.deleteTransaction(id);
  if(result[0].affectedRows === 1) {
    return { status: 'ok', message: '내역 삭제 완료', data: id };
  }
  if(result[0].affectedRows === 0) {
    return { status: 'fail', message: '존재하지 않는 내역입니다.' };
  }

  return null;
}


export default {
  getTransactionByUserId,
  deleteTransaction,
  createTransaction,
  updateTransaction,
  getTransactionById,
  getTransactionByUserIdAndDate,
};