/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */

import pool from '../config/database';
import CategoryDTO from '../model/categoryDTO';

async function deleteCategory(id:Number) {
  const result = await pool.query(`delete from mydb.category where id= ${id}`);
  return result;
}
async function updateCategory(category:CategoryDTO) {
  const result = await pool.query(`create from mydb.category where id= ${category.getId()}`);
  return result;
}

async function createCategory(category:CategoryDTO) {
  const result = await pool.query('insert into mydb.category set ?', category);
  return result;
}

async function getCategoryByState(state:string) {
  const result = await pool.query(`select * from mydb.category where state = \'${state}\';`);
  return result[0];
}

export default {
  updateCategory,
  deleteCategory,
  createCategory,
  getCategoryByState,
};