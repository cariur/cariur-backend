const jwt = require("jsonwebtoken");
const { generateTokens } = require("../config/jwt");
const User = require("../models/User");

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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

async function authMiddleware(req, res, next) {
  const accessToken = req.cookies["access_token"];
  console.log(accessToken);
  if (!accessToken) {
    return res.status(401).json({ message: "Access token not found" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return refreshAccessToken(req, res, next);
    }
    return res.status(403).json({ message: "Invalid access token" });
  }
}

async function refreshAccessToken(req, res, next) {
  const refreshToken = req.cookies["refresh_token"];
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { accessToken } = generateTokens(user);
    const cookieOptions = getCookieOptions(req);
    res.cookie("access_token", accessToken, cookieOptions);
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
}

module.exports = { authMiddleware, refreshAccessToken };
