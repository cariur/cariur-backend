const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken"); // Import your authentication middleware

const router = express.Router();

router.post("/register", createUser);

router.post("/login", loginUser);

router.get("/profile", authenticateToken, getUserProfile);

router.put("/profile", authenticateToken, updateUserProfile);

router.delete("/profile", authenticateToken, deleteUser);

module.exports = router;
