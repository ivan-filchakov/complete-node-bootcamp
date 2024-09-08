/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      validate: {
        // only on save/create. not for patch update
        validator: function (val) {
          return val === this.password;
        },
      },
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

async function handlePass(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
}
userSchema.pre('save', handlePass);

const User = mongoose.model('User', userSchema);
module.exports = User;
