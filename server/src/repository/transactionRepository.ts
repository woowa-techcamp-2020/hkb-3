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
  const result = await pool.query('insert into mydb.transaction set ', transaction);
  return result;
}

async function createTestTransaction(userId:number) {
  const result = await pool.query(`delete from mydb.transaction where user_id = ${userId};
    insert INTO mydb.transaction VALUES (NULL,'영화관', '2020-08-31 00:00:00', '24000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 7 , ${userId}, 1);
    insert INTO mydb.transaction VALUES (NULL,'월급', '2020-08-31 00:00:00', '4500000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 1 , ${userId}, 3);
    insert INTO mydb.transaction VALUES (NULL,'맛집 탐방', '2020-08-30 00:00:00', '24000', '2020-08-30 00:00:00', '2020-08-30 00:00:00', 3 , ${userId}, 2);
    insert INTO mydb.transaction VALUES (NULL,'맥북 구입', '2020-08-30 00:00:00', '2400000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 7 , ${userId}, 3);
    insert INTO mydb.transaction VALUES (NULL,'용돈', '2020-08-30 00:00:00',  '300000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 9 , ${userId}, 2);
    insert INTO mydb.transaction VALUES (NULL,'병원 진료', '2020-08-29 00:00:00', '14000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 6 , ${userId}, 1);
    insert INTO mydb.transaction VALUES (NULL,'옷 쇼핑', '2020-08-28 00:00:00', '114000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 5 , ${userId}, 3);
    insert INTO mydb.transaction VALUES (NULL,'길에서 주움', '2020-08-27 00:00:00',  '500', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 10 , ${userId}, 2);
    insert INTO mydb.transaction VALUES (NULL,'맥도날드', '2020-08-26 00:00:00', '12000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 3 , ${userId}, 1);

    insert INTO mydb.transaction VALUES (NULL,'바스버거', '2020-09-30 00:00:00', '34000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 3 , ${userId}, 3);
    insert INTO mydb.transaction VALUES (NULL,'용돈', '2020-09-25 00:00:00', '10000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 9 , ${userId}, 2);
    insert INTO mydb.transaction VALUES (NULL,'해외여행', '2020-09-24 00:00:00', '1536000', '2020-08-30 00:00:00', '2020-08-30 00:00:00', 7 , ${userId}, 1);
    insert INTO mydb.transaction VALUES (NULL,'맥북 구입', '2020-09-16 00:00:00', '24000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 7 , ${userId}, 2);
    insert INTO mydb.transaction VALUES (NULL,'용돈', '2020-09-14 00:00:00',  '300000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 9 , ${userId}, 3);
    insert INTO mydb.transaction VALUES (NULL,'병원 진료', '2020-09-13 00:00:00', '14000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 6 , ${userId}, 2);
    insert INTO mydb.transaction VALUES (NULL,'옷 쇼핑', '2020-09-13 00:00:00', '114000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 5 , ${userId}, 1);
    insert INTO mydb.transaction VALUES (NULL,'길에서 주움', '2020-09-13 00:00:00',  '500', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 10 , ${userId}, 1);
    insert INTO mydb.transaction VALUES (NULL,'맥도날드', '2020-09-11 00:00:00', '12000', '2020-08-31 12:00:00', '2020-08-31 12:00:00', 3 , ${userId}, 3);
  `);
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
  createTestTransaction,
};