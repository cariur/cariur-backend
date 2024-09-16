const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  googleAuth,
  refreshToken,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken"); // Import your authentication middleware

const router = express.Router();
router.post("/auth/google", googleAuth);
router.post("/register", createUser);
router.post("/refresh-token", refreshToken);
router.post("/login", loginUser);

router.get("/profile", authenticateToken, getUserProfile);

router.put("/profile", authenticateToken, updateUserProfile);

router.delete("/profile", authenticateToken, deleteUser);

module.exports = router;
