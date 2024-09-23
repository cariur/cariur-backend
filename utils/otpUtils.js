// utils/otpUtils.js
const crypto = require("crypto");

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};

const saveOtp = async (user, otp) => {
  user.otp = otp; // Save OTP in the user document
  await user.save();
};

const verifyOtp = (user, otp) => {
  return user.otp === otp; // Compare saved OTP with user input
};

module.exports = { generateOtp, saveOtp, verifyOtp };
