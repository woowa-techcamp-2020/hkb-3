import express, { Request, Response } from 'express';
import path from 'path';

import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();

app.use('/', indexRouter);
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



export default app;
