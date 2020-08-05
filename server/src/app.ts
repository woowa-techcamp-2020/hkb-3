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
import Oauth2 from 'passport-oauth2';
import sessionFileStore from 'session-file-store';
import PassportGithub from 'passport-github2';
import indexRouter from './routes/index';
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

passport.use(new Oauth2.Strategy({
  authorizationURL: 'https://github.com/login/oauth/authorize',
  tokenURL: 'https://github.com/login/oauth/access_token',
  clientID: 'f764d2d4b757b7705a44',
  clientSecret: '24e47fffaecab54fc3a6ed807e20fc7c85d2462b',
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
((accessToken: any, refreshToken: any, profile: any, cb: any) => {
  console.log(profile);
  if(profile.id === 'myungwoo-Y') {
    cb(null, profile.id);
  }
})));

passport.use(new PassportGithub.Strategy({
  clientID: 'f764d2d4b757b7705a44',
  clientSecret: '24e47fffaecab54fc3a6ed807e20fc7c85d2462b',
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
((accessToken: any, refreshToken: any, profile: any, done: any) => {
  console.log(profile);
  if(profile.id === 'myungwoo-Y') {
    done(null, profile.id);
  }
})));

const LocalStrategy = passportLocal.Strategy;

interface IUser {
  id: string,
  password: string
}
const authData: IUser = {
  id: 'test',
  password: '1234',
};

passport.serializeUser((user: IUser, done: any) => {
  console.log('Serialize');
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  console.log('Deserialize');
  if(authData.id === id) {
    done(null, id);
  }
});

passport.use(new LocalStrategy(
  ((username:string, password:string, done: any) => {
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
