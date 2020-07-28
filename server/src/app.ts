import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import passport from 'passport';
import session from 'express-session';
import passportLocal from 'passport-local';
import sessionFileStore from 'session-file-store';
import usersRouter from './routes/users';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();

app.use('/users', usersRouter);


/** ************************************
 *               Set Swagger
 *************************************** */
const swaggerDefinition = {
  info: { // API informations (required)
    title: 'HKB APIS', // Title (required)
    version: '1.0.0', // Version (required)
    description: '', // Description (optional)
  },
  host: 'localhost:3000', // Host (optional)
  basePath: '/', // Base path (optional)
};
  
// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['./src/routes/users.*'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));




/** ************************************
 *             Set Passport
 *************************************** */
const FileStore = sessionFileStore(session);
const LocalStrategy = passportLocal.Strategy;

interface IUser {
  id: string,
  password: string
}
const authData: IUser = {
  id: 'test',
  password: '1234',
};

app.use(session({ 
  secret: '비밀코드', 
  resave: true, 
  saveUninitialized: false,
  store: new FileStore(), 
})); // 세션 활성화
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: IUser, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  if(authData.id === id) {
    done(null, id);
  }
});

passport.use(new LocalStrategy(
  ((username:any, password:any, done: any) => {
    if(username === authData.id) {
      if(password === authData.password) {
        return done(null, authData);
      }
      return done(null, false, {
        message: 'Incorrect password.',
      });
    }
    return done(null, false, {
      message: 'Incorrect username.',
    });
  }),
));

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));


app.get('/logout', (req: any, res: Response) => {
  req.logout();
  req.session.save(() => {
    res.redirect('/login');
  });
});

const isAuthenticated = (req:any, res: Response, next: NextFunction) => {
  if (req.user) return next();
  res.redirect('/login');
};


/** ***********************************
 *        Serve front-end content
 *************************************** */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', isAuthenticated, (req: Request, res: Response) => {
  res.sendFile('index.html', { root: viewsDir });
});



export default app;
