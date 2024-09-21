const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { generateTokens } = require("../config/jwt");

const generateUsername = (name) => {
  const usernameBase = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${usernameBase}${randomSuffix}`;
};

const getCookieOptions = (req) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost =
    req.get("host").includes("localhost") ||
    req.get("host").includes("127.0.0.1");

  return {
    httpOnly: true,
    secure:
      isProduction ||
      req.secure ||
      req.headers["x-forwarded-proto"] === "https",
    sameSite: isProduction && !isLocalhost ? "None" : "Lax",
    domain:
      isProduction && !isLocalhost ? process.env.PRODUCTION_DOMAIN : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.redirect("/login?error=authentication_failed");
    }
    const { accessToken, refreshToken } = generateTokens(user);
    const cookieOptions = getCookieOptions(req);
    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);
    res.redirect(process.env.FRONTEND_URL);
  })(req, res);
};

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
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
    const user = await newUser.save();
    const { accessToken, refreshToken } = generateTokens(user);
    const cookieOptions = getCookieOptions(req);
    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateTokens(user);
    const cookieOptions = getCookieOptions(req);
    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req || !req.userId) {
      return res.status(400).json({ message: "User information is missing" });
    }

    const user = await User.findById(req.userId).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
