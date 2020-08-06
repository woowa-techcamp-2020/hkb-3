import express from 'express';
import UserDTO from '../model/userDTO';
import userService from '../service/userService';
import userRepo from '../repository/userRepository';

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
  res.json(result);
});

/* GET users listing. */
router.get('/user/:id', async (req, res, next) => {
  const result = await userRepo.getUserById(Number(req.params.id));
  res.json(result);
});

/* GET users listing. */
router.get('/info', async (req, res, next) => {
  const result = await userService.getUserInfo(req.user);
  res.json(result);
});



/* GET users listing. */
router.post('/user', async (req, res, next) => {
  const userDTO = new UserDTO(req.body);
  const result = await userService.createUser(userDTO);
  res.json(result);
});

export default router;
