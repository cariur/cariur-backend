const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../utils/jwtUtils");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ message: "Authorization header is missing" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token is missing" });

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
