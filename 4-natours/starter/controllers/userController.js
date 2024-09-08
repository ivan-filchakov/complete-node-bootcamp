const User = require('../models/userModel');
const catchAsync = require('../common/catch-async');
const BaseService = require('../services/baseService');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const service = new BaseService(User.find(), req.query)
    .filter()
    .sort()
    .select()
    .paginate();
  const users = await service.query;
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
