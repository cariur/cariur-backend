const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  googleAuth,
  googleCallback,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
