/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 99,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 99,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 64,
    },
    passwordConfirm: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 64,
    },
    photo: {
      type: String,
      required: false,
      trim: true,
      default: 'default-image.jpg',
    },
  },
  {},
);

const User = mongoose.model('Tour', userSchema);
module.exports = User;
