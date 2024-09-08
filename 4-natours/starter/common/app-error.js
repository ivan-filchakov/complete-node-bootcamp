class AppError extends Error {
  constructor(props) {
    super(props.message);

    this.statusCode = props.statusCode;
    this.status = `${props.statusCode}`.startsWith('4') ? 'fail' : 'error';
    // errors can be operational or programming (parts 110-115)
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
