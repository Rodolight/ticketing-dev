require('dotenv').config();
import express from 'express';
import 'express-async-errors' 
import cookieSession from 'cookie-session';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

//Middlewares
import { errorHandler, NotFoundError, currentUser  } from '@rdpticketsv/common';


const app = express();
const port = process.env.PORT || 3001;
app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter)
app.use(deleteOrderRouter);

app.all('*', async(req, res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export { app, port }