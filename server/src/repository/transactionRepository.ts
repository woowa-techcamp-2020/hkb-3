/* eslint-disable camelcase */

import pool from '../config/database';
import TransactionDTO from '../model/transactionDTO';

async function deleteTransaction(id:Number) {
  const result = await pool.query(`delete from mydb.transaction where id= ${id}`);
  return result;
}
async function updateTransaction(transaction:TransactionDTO) {
  const result = await pool.query(`create from mydb.transaction where id= ${transaction.getId()}`);
  return result;
}

async function createTransaction(transaction:TransactionDTO) {
  const result = await pool.query('insert into mydb.transaction set ?', transaction);
  return result;
}

async function getTransactionByUserId(user_id:number) {
  const result = await pool.query(`select transaction.id id, transaction.contents contents, transaction.date date, transaction.state state, 
          transaction.amount amount, transaction.created_at created_at, transaction.updated_at updated_at,
              payment.id payment_id, payment.method payment_method,
              category.id category_id, category.name category_name
      from transaction 
        left join user 
          on transaction.user_id = user.id 
        left join payment
          on transaction.payment_id = payment.id
        left join category
          on transaction.category_id = category.id
            where user.id = ${user_id}
          order by date desc;`);
  return result[0];
}

export default {
  updateTransaction,
  deleteTransaction,
  createTransaction,
  getTransactionByUserId,
};