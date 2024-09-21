const express = require("express");
const { googleAuth, googleCallback } = require("../controllers/userController");
const router = express.Router();

const getCookieOptions = (req) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost =
    req.get("host").includes("localhost") ||
    req.get("host").includes("127.0.0.1");

  return {
    httpOnly: true,
    secure:
      isProduction ||
      req.secure ||
      req.headers["x-forwarded-proto"] === "https",
    sameSite: isProduction && !isLocalhost ? "None" : "Lax",
    domain:
      isProduction && !isLocalhost ? process.env.PRODUCTION_DOMAIN : undefined,
  };
};

router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);

// Logout route
router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    // Clear cookies
    const cookieOptions = getCookieOptions(req);
    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);

    console.log("user logged out");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
