const nodemailer = require("nodemailer");
const User = require("../models/User");
const { generateOtp, saveOtp, verifyOtp } = require("../utils/otpUtils");
const { generateTokens } = require("../config/jwt");

const transporter = nodemailer.createTransport({
  service: "gmail", // Change to your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateAndSendOtp = async (email) => {
  const otp = generateOtp();
  const user = await User.findOne({ email });

  if (user) {
    await saveOtp(user, otp);

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });
  } else {
    throw new Error("User not found");
  }
};

const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  console.log("User found:", user); // Log user data
  if (user) {
    console.log("Stored OTP:", user.otp); // Log stored OTP
    console.log("Provided OTP:", otp); // Log provided OTP

    if (verifyOtp(user, otp)) {
      user.isVerified = true;
      user.otp = undefined; // Clear OTP
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user);
      return res.status(200).json({
        status: "success",
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            isVerified: user.isVerified,
            email: user.email,
            username: user.username,
          },
        },
      });
    }
  }

  return res.status(400).json({
    status: "error",
    message: "Invalid OTP",
  });
};

module.exports = { generateAndSendOtp, verifyOtpController };
