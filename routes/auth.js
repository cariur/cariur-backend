const express = require("express");
const passport = require("passport");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Google Auth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;
    const redirectUrl = `${process.env.FRONTEND_URL}/login/success?token=${token}`;
    res.redirect(redirectUrl); // Redirect to frontend with token in query params
  }
);

module.exports = router;
