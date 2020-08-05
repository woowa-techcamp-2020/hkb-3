import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   AuthUser:
 *     type: object
 *     required:
 *       - content
 *     properties:
 *       username:
 *         type: string
 *         description: user id
 *       password:
 *         type: string
 *         description: user password
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - login
 *     description: User login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authUser
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/AuthUser'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  }));

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: remove user session
 *     tags: [login]
 *     responses:
 *       200:
 *         description: Successfully remove user
 */
router.get('/logout', (req: any, res: Response) => {
  req.logout();
  req.session.save(() => {
    res.redirect('/auth/login');
  });
});

// router.get('/github',
//   passport.authenticate('oauth2', {
//     scope: ['profile', 'email'],
//   }));

// router.get('/github/callback',
//   passport.authenticate('oauth2', { failureRedirect: '/auth/login' }),
//   (req, res) => {
//     console.log(req.query);
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

export default router;
