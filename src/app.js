import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import bookRoutes from './routes/books';

dotenv.config();

const app = express();
// enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/', bookRoutes);

const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port);
    console.log(process.env.NODE_ENV, `server started on port ${port}.`); // eslint-disable-line no-console
  })
  .catch((err) => {
    throw new Error(err);
  });
