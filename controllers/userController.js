const User = require("../models/User");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwtUtils");
const generateUsername = (name) => {
  const usernameBase = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${usernameBase}${randomSuffix}`;
};

exports.googleAuth = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google token with Google's tokeninfo endpoint
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`
    );

    if (response.status !== 200) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, name, picture } = response.data;
    const [firstName, lastName] = name.split(" "); // Simple split, adjust if needed

    // Generate a random username including the user's name
    const username = generateUsername(firstName);

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate and return access and refresh tokens
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      user.refreshToken = refreshToken;
      await user.save();
      return res.status(200).json({
        accessToken,
        refreshToken,
        expires_in: process.env.JWT_EXPIRATION,
      });
    }

    // User does not exist, create a new user
    user = new User({
      googleId,
      firstName,
      lastName,
      username,
      email,
      profilePicture: picture || "default-profile.png", // Use Google profile picture or default
    });

    await user.save();

    // Generate and return access and refresh tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken; // Save refresh token to the user document
    await user.save();

    return res.status(201).json({
      accessToken,
      refreshToken,
      expires_in: process.env.JWT_EXPIRATION,
    });
  } catch (error) {
    console.error("Error in googleAuth controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Register a new user
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      profilePicture,
      bio,
      skills,
      address,
      phone,
      website,
      dateOfBirth,
      gender,
      isAdmin,
      notifications,
      socialMedia,
      twoFactor,
      isVerified,
      verificationToken,
      preferences,
      lastActivity,
      isDeleted,
      roles,
      verificationCode,
      loginAttempts,
      accountLockedUntil,
      mentor,
      mentees,
      profileCompletion,
      accountSource,
      tags,
      securityQuestions,
      activityLogs,
      subscription,
      paymentInfo,
      customFields,
      externalIds,
      isDeactivated,
      deactivationReason,
      userSettings,
    } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      profilePicture,
      bio,
      skills,
      address,
      phone,
      website,
      dateOfBirth,
      gender,
      isAdmin,
      notifications,
      socialMedia,
      twoFactor,
      isVerified,
      verificationToken,
      preferences,
      lastActivity,
      isDeleted,
      roles,
      verificationCode,
      loginAttempts,
      accountLockedUntil,
      mentor,
      mentees,
      profileCompletion,
      accountSource,
      tags,
      securityQuestions,
      activityLogs,
      subscription,
      paymentInfo,
      customFields,
      externalIds,
      isDeactivated,
      deactivationReason,
      userSettings,
    });

    // Save the user to the database
    const user = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        skills: user.skills,
        address: user.address,
        phone: user.phone,
        website: user.website,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        notifications: user.notifications,
        socialMedia: user.socialMedia,
        twoFactor: user.twoFactor,
        isVerified: user.isVerified,
        preferences: user.preferences,
        lastActivity: user.lastActivity,
        isDeleted: user.isDeleted,
        roles: user.roles,
        verificationCode: user.verificationCode,
        loginAttempts: user.loginAttempts,
        accountLockedUntil: user.accountLockedUntil,
        mentor: user.mentor,
        mentees: user.mentees,
        profileCompletion: user.profileCompletion,
        accountSource: user.accountSource,
        tags: user.tags,
        securityQuestions: user.securityQuestions,
        activityLogs: user.activityLogs,
        subscription: user.subscription,
        paymentInfo: user.paymentInfo,
        customFields: user.customFields,
        externalIds: user.externalIds,
        isDeactivated: user.isDeactivated,
        deactivationReason: user.deactivationReason,
        userSettings: user.userSettings,
      },

      token,
      expires_in: process.env.JWT_EXPIRATION,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Email:", email); // Log email
  console.log("Password:", password); // Log password

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (user) {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generate tokens
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save();

        // Respond with user data and tokens
        return res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accessToken,
          refreshToken,
          expires_in: process.env.JWT_EXPIRATION,
        });
      } else {
        // Invalid password
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      // User not found
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error.message); // Log error message
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    console.log(refreshToken);
    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);

    console.log(payload);
    // Find user by ID
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = generateToken(user._id);

    res.json({ accessToken, expires_in: process.env.JWT_EXPIRATION });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // Check if req.user exists
    console.log(req.user);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User information is missing" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.username = req.body.username || user.username;

      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;
      user.website = req.body.website || user.website;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.gender = req.body.gender || user.gender;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        address: updatedUser.address,
        phone: updatedUser.phone,
        website: updatedUser.website,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
