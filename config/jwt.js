const jwt = require("jsonwebtoken");

function generateTokens(user) {
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15ms",
  });
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "9d" }
  );
  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
