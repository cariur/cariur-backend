const jwt = require("jsonwebtoken");

function generateTokens(user) {
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Corrected to 15 minutes
  });
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "9d" } // 9 days is fine for refresh tokens
  );
  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
