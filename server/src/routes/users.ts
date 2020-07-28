import express from 'express';

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
export default router;
