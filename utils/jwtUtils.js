// utils/jwtUtils.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" }); // 15 minutes
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // 7 days
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid or expired token");
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error("Refresh token verification error:", error);
    throw new Error("Invalid or expired refresh token");
  }
};

const rotateRefreshToken = (oldRefreshToken) => {
  try {
    const decoded = verifyRefreshToken(oldRefreshToken);
    const newRefreshToken = generateRefreshToken(decoded.id);
    return { valid: true, newRefreshToken };
  } catch (error) {
    return { valid: false };
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  rotateRefreshToken,
};
