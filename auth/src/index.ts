// const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
import mongoose from 'mongoose';
import { app, port } from './app';

const start = async () => {
  console.log('Starting up...!');
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined')
  }

  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined')
  }

  try {
  await mongoose.connect(process.env.MONGO_URI || '', {
    autoIndex: true
    });
    console.log('Connected to MongoDB.')
  } catch (err) {
     console.log(err);
     
  }

app.listen( port, () =>{
  console.log('Listening on port '+ port + '!');
});
};

start();