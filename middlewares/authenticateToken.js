const jwtUtils = require("../utils/jwtUtils");
exports.authenticateToken = (req, res, next) => {
  console.log("Cookies:", req.cookies); // Log cookies to verify presence of accessToken
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded; // Attach user to request object
    next();
  } catch (err) {
    console.error("Token verification error:", err); // Log error details
    return res.status(403).json({ message: "Invalid or expired access token" });
  }
};
