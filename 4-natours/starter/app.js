const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
// eslint-disable-next-line no-console
console.info({ development_mode: process.env.NODE_ENV });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); /* HTTP request logger */
}

// MIDDLEWARE

app.use(express.json()); /* parse body */

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use(express.static(`${__dirname}/public`)); /* static files access */

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello from the server!',
  });
});

module.exports = app;
