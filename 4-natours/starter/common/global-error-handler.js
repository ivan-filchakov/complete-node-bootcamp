/* eslint-disable no-unused-vars */
const AppError = require('./app-error');

function sendErrorDev(err, req, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, req, res) {
  // OPERATIONAL ERROR WE TRUST AND SEND TO CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // PROGRAMING ERROR OR OTHER UNKNOWN SHIT
    // eslint-disable-next-line no-console
    console.error(err);
    // GENERIC MESSAGE
    res.status(500).json({
      status: 'error',
      message: 'oops! something went wrong!',
    });
  }
}

function handleCastErrorDB(err) {
  return new AppError({
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}`,
  });
}

function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
    return;
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    sendErrorProd(error, req, res);
  }
}

module.exports = globalErrorHandler;
