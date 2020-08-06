import moment from 'moment';
import categoryDTO from '../model/categoryDTO';
import categoryRepo from '../repository/categoryRepository';

async function createCategory(category:categoryDTO) {
  const result = await categoryRepo.createCategory(category);
  console.log('error?', result);
  return result;
}

async function getCategoryByState(state:string) {
  const result = await categoryRepo.getCategoryByState(state);
  
  if(result.length > 0) {
    return { status: 'ok', message: '내역 검색 완료', data: result };
  }
  
  return { status: 'fail', message: '내역없음' };
}

async function updateCategory(trans:categoryDTO) {
  const result = categoryRepo.updateCategory(trans);
  return result;
}
  
async function deleteCategory(id:Number) {
  const result = categoryRepo.deleteCategory(id);
  return result;
}


export default {
  getCategoryByState,
  deleteCategory,
  createCategory,
  updateCategory,
};