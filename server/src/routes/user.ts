import express from 'express';
import userService from '../service/userService';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: users
 *   description: Todo management
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - content
 *     properties:
 *       id:
 *         type: string
 *         description: user id
 *       password:
 *         type: string
 *         description: user password
 *       name:
 *         type: string
 *         description: user name
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns User list
 *     tags: [Todo]
 *     responses:
 *       200:
 *         description: user list
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/user', async (req, res, next) => {
  const result = await userService.getAllUsers();
  console.log('userRouter \n', result);
  res.json(result);
});

/* GET users listing. */
router.get('/user/:id', async (req, res, next) => {
  const result = await userService.getUserById(Number(req.params.id));
  // console.log('userRouter \n', result);
  res.json(result);
});

export default router;
