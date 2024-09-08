function globalErrorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

module.exports = globalErrorHandler;
