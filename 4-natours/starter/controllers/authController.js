const User = require('../models/userModel');
const catchAsync = require('../common/catch-async');

module.exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});
