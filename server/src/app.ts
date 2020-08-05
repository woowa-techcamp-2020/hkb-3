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
import cors from 'cors';
import sessionFileStore from 'session-file-store';
import PassportGithub from 'passport-github2';
import indexRouter from './routes/index';
import userService from './service/userService';
// import loginRouter from './routes/login';


const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


/** ************************************
 *            Passport setup
 *************************************** */
const FileStore = sessionFileStore(session);
app.use(session({ 
  secret: '비밀코드', 
  resave: true, 
  saveUninitialized: false,
  store: new FileStore(), 
})); // 세션 활성화
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

interface IUser {
  id: string,
  password: string,
  username?: string,
  email?: string
  type?: string
}
const authData: IUser = {
  id: 'test',
  password: '1234',
  username: 'myungwoo-Y',
};

passport.serializeUser((user: IUser, done: any) => { 
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
  const res = await userService.getUserById(id);
  if(res.status === 'ok') {
    const user = res.data[0] as IUser;
    return done(null, user);
  }
  return done(null, false, {
    message: 'Incorrect user.',
  });
});

passport.use(new PassportGithub.Strategy({
  clientID: 'f764d2d4b757b7705a44',
  clientSecret: '24e47fffaecab54fc3a6ed807e20fc7c85d2462b',
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
((accessToken: any, refreshToken: any, profile: any, done: any) => {
  console.log(profile);
  if(profile.username === 'myungwoo-Y') {
    done(null, profile);
  }
})));

const LocalStrategy = passportLocal.Strategy;


passport.use(new LocalStrategy({ // local 전략을 세움
  usernameField: 'useremail',
  passwordField: 'password',
},
((useremail:string, password:string, done: any) => {
  userService.getUserByEmail(useremail).then((res) => {
    const user = res.data[0] as IUser;
    if(res.status === 'ok') {
      if(useremail === user.email) {
        if(password === user.password) {
          return done(null, { ...user, type: 'local' });
        }
        return done(null, false, {
          message: 'Incorrect password.',
        });
      }
    }
    return done(null, false, {
      message: 'Incorrect useremail.',
    });
  });
})));


const isAuthenticated = (req:any, res: Response, next: NextFunction) => {
  console.log('request');
  if (req.user) {
    return next();
  }

  const loginUrl = '/auth/login';

  if(req.originalUrl !== loginUrl) {
    res.redirect(loginUrl);
  } 
  return next();
};




/** ************************************
 *               Routing
 *************************************** */
require('dotenv').config();

const scriptRequestUrl = '/public';
app.use(scriptRequestUrl, express.static(`${__dirname}${scriptRequestUrl}`));
// app.use('/auth', loginRouter);
app.use('/', indexRouter);





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
const routerDir = './src/routes';  
// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: [`${routerDir}/users.*`, `${routerDir}/login.*`],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec));







/** ***********************************
 *        Serve front-end content
 *************************************** */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);


app.get('*', /* isAuthenticated, */ (req: Request, res: Response) => {
  res.sendFile('index.html', { root: viewsDir });
});



export default app;
