/* eslint-disable camelcase */

import pool from '../config/database';
import TransactionDTO from '../model/transactionDTO';

async function deleteTransaction(id:Number) {
  const result = await pool.query(`delete from mydb.transaction where id= ${id}`);
  return result;
}
async function updateTransaction(transaction:TransactionDTO) {
  const sql = 'UPDATE mydb.transaction set contents= ?, date= ?, amount= ?, updated_at= ?, category_id= ?,payment_id = ? where id = ?';
  const data = [
    transaction.getContents(),
    transaction.getDate(),
    transaction.getAmount(),
    transaction.getUpdatedAt(),
    transaction.getCategoryId(),
    transaction.getPaymentId(),
    transaction.getId(),
  ];
  
  const result = await pool.query(sql, data);
  return result;
}

async function createTransaction(transaction:TransactionDTO) {
  const result = await pool.query('insert into mydb.transaction set ?', transaction);
  return result;
}

// 현재 디비
async function getTransactionById(id:number) {
  const result = await pool.query(`select transaction.id id, transaction.contents contents, transaction.date date, 
            transaction.amount amount, transaction.created_at created_at, transaction.updated_at updated_at,
                payment.id payment_id, payment.method payment_method,
                category.id category_id, category.name category_name, category.state state,
                user.id user_id
          from transaction 
          left join user 
            on transaction.user_id = user.id 
          left join payment
            on transaction.payment_id = payment.id
          left join category
            on transaction.category_id = category.id
              where transaction.id = ${id};`);
  return result[0];
}

// 현재 디비
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
          order by date desc, transaction.created_at desc;`);
  return result[0];
}

// 테스트 디비
async function getTransactionByUserIdAndDate(user_id:number, date:string) {
  console.log(user_id, date);
  const result = await pool.query(`select transaction.id id, transaction.contents contents, transaction.date date, 
                transaction.amount amount, transaction.created_at created_at, transaction.updated_at updated_at,
                    payment.id payment_id, payment.method payment_method,
                    category.id category_id, category.name category_name, category.state state
              from transaction 
              left join user 
                on transaction.user_id = user.id 
              left join payment
                on transaction.payment_id = payment.id
              left join category
                on transaction.category_id = category.id
                  where user.id = ${user_id}
                  and transaction.date like '${date}%'
                order by date desc, transaction.created_at desc`);
  return result[0];
}

// and transaction.date like '2020-08%'

export default {
  updateTransaction,
  deleteTransaction,
  createTransaction,
  getTransactionById,
  getTransactionByUserId,
  getTransactionByUserIdAndDate,
};