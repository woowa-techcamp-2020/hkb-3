import express from 'express';
import categoryService from '../service/categoryService';
import categoryRepo from '../repository/categoryRepository';
import CategoryDTO from '../model/categoryDTO';

const router = express.Router();


router.get('/category/:state', async (req, res, next) => {
  const result = await categoryService.getCategoryByState(req.params.state);
  // console.log('categoryRouter \n', result);
  res.json(result);
});

/* GET users listing. */
router.post('/category', async (req, res, next) => {
  const categoryDTO = new CategoryDTO(req.body);
  const result = await categoryRepo.createCategory(categoryDTO);
  res.json(result);
});


export default router;
