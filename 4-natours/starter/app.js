/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./common/app-error');
const globalErrorHandler = require('./common/global-error-handler');

const app = express();
console.info({ development_mode: process.env.NODE_ENV });
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); /* HTTP request logger */
}

// MIDDLEWARE
app.use(express.json()); /* parse body */

function globalMiddleware(req, res, next) {
  req.requestTime = new Date().toISOString();
  console.log('request time:', req.requestTime);
  next();
}
app.use(globalMiddleware);

// app.use(express.static(`${__dirname}/public`)); /* static files access */

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

function handleBadRoute(req, res, next) {
  throw new AppError({
    message: `bad url: ${req.originalUrl}`,
    status: 'fail',
    statusCode: 404,
  });
}
app.all('*', handleBadRoute);

app.use(globalErrorHandler);

module.exports = app;

// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Hello from the server!',
//   });
// });
