const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtUtils");
const crypto = require("crypto");

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

const generateRandomUsername = (name) => {
  const randomNumber = Math.floor(Math.random() * 10000);
  const randomWord = crypto.randomBytes(4).toString("hex");
  return `${name
    .toLowerCase()
    .replace(/\s+/g, "")}${randomNumber}${randomWord}`;
};

exports.register = async (req, res) => {
  console.log("Generated username:");
  const { email, firstName, lastName } = req.body;
  const password = generateRandomPassword();
  const username = generateRandomUsername(`${firstName} ${lastName}`);

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username: username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      username,
      password,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
