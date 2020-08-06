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
import DotEnv from 'dotenv';
import indexRouter from './routes/index';
import userService from './service/userService';
import SocialUserDTO from './model/socialUserDTO';

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
  id: number,
  email?: string,
  password?: string,
  name?: string,
  socialID?: number,
  type?: string
}

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

DotEnv.config();
passport.use(new PassportGithub.Strategy({
  clientID: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  callbackURL: process.env.CALLBACK_URL as string,
},
((accessToken: any, refreshToken: any, profile: any, done: any) => {
  const userJson = profile._json;
  // 유저 찾기
  userService.getUserBySocialId(userJson.id).then((res) => {
    if(res.status === 'ok') { 
      const user = res.data[0] as IUser;
      done(null, user);
    }else{
      const socialUserDTO = new SocialUserDTO({
        social_id: userJson.id,
        name: userJson.login,
        created_at: userJson.created_at,
        updated_at: userJson.updated_at,
      });
      // 유저 생성
      userService.createSocialUser(socialUserDTO).then((createRes) => {
        const { insertId } = createRes[0];
        const user:IUser = {
          id: insertId,
          socialID: userJson.id,
          name: userJson.login,
        };
        // 로그인 이동
        done(null, user);
      });
    }
  });
})));

const LocalStrategy = passportLocal.Strategy;


passport.use(new LocalStrategy({ // local 전략을 세움
  usernameField: 'useremail',
  passwordField: 'password',
},
((useremail:string, password:string, done: any) => {
  userService.getUserByEmail(useremail).then((res) => {
    if(res.status === 'ok') {
      const user = res.data[0] as IUser;
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
  if (req.user) {
    console.log('isauthenticated');
    return next();
  }

  const loginUrl = '/auth/login';
  const signupUrl = '/auth/signup';

  if(req.originalUrl === loginUrl || req.originalUrl === signupUrl) {
    return next();
  }
  res.redirect(loginUrl);
};




/** ************************************
 *               Routing
 *************************************** */

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
  host: process.env.SWAGGER_HOST, // Host (optional)
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
 *        Serve front-end content`
 *************************************** */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);


app.get('*', isAuthenticated, (req: Request, res: Response) => {
  res.sendFile('index.html', { root: viewsDir });
});



export default app;
