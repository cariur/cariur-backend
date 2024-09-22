const express = require("express");
const {
  generateAndSendOtp,
  verifyOtpController,
} = require("../controllers/otpController");
const router = express.Router();

// Route to generate and send OTP
router.post("/api/otp/generate", async (req, res) => {
  const { email } = req.body;
  try {
    await generateAndSendOtp(email);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
});

// Route to verify OTP
router.post("/api/otp/verify", verifyOtpController);

module.exports = router;
