/* eslint-disable import/no-extraneous-dependencies */
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
      statusCode: 403,
      message: 'authentication fail',
    });
  }
  // 3. send token if ok
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
