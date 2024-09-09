/* eslint-disable import/no-extraneous-dependencies */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../common/catch-async');
const AppError = require('../common/app-error');

function signToken(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}

module.exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. check email and password provided
  if (!email || !password) {
    throw new AppError({
      statusCode: 400,
      message: 'email and password must be provided',
    });
  }
  // 2. check user exists and pass is correct
  const user = await User.findOne({ email }).select('+password');
  const authSuccess = user
    ? await user.checkPassword(password, user.password)
    : false;
  if (!user || !authSuccess) {
    throw new AppError({
      statusCode: 401,
      message: 'authentication fail. email-password doesnt match',
    });
  }
  // 3. send token if ok
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports.protectAuth = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  // 1. check token provided
  const token = authorization ? authorization.split('Bearer ')[1] : null;
  if (!authorization || !token) {
    throw new AppError({
      statusCode: 401,
      message: 'authentication fail. no token bearer',
    });
  }
  // 2. token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3. check user still exists
  const user = await User.findById(decoded.id).select('+passwordChangedAt');
  if (!user) {
    throw new AppError({
      statusCode: 401,
      message: 'authentication fail. user no longer exists',
    });
  }
  // 4. check if there was password change
  const tokenIssuedAt = new Date(
    decoded.iat * 1000 /* iat somehow comes in SECONDS instead of MS */,
  );
  const passWasChanged = user.checkPasswordWasChangedAfter(tokenIssuedAt);
  if (passWasChanged) {
    throw new AppError({
      statusCode: 401,
      message: 'authentication fail. password was changed',
    });
  }
  // grant access to protected route
  req.user = user;
  next();
});

module.exports.checkRoles =
  (...roles) =>
  (req, res, next) => {
    const hasAccess = roles.includes(req.user.role);
    if (!hasAccess) {
      throw new AppError({
        statusCode: 403,
        message: 'You do not have permission to do this',
      });
    }
    next();
  };

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new AppError({
      statusCode: 404,
      message: 'user not found',
    });
  }
  // 2. generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  next();
  // 3. send token to user
});

module.exports.resetPassword = (req, res, next) => {};
