// services/userService.js
const User = require('../models/User');

const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

module.exports = { createUser, findUserByEmail };
