'use strict';
import Mongoose from 'mongoose';
import { dbUrl } from './env';

export const dbConnect = async () => {
  //Connect to MongoDB
  await Mongoose.connect(dbUrl!)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('MongoDB Error: ' + error.message));

  // Get the default connection
  const db = Mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
