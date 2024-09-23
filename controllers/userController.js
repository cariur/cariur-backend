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

  return {
    httpOnly: true, // Should be true for better security
    sameSite: isProduction ? "None" : "Lax", // Use "None" for cross-origin in production, "Lax" for localhost
    secure: isProduction, // Enable secure cookies only in production
    domain: process.env.PRODUCTION_DOMAIN || "localhost", // Ensure domain is properly set
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
exports.googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.error(err);
      return res.redirect("/login?error=authentication_failed");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: "Google authentication successful",
      accessToken,
      refreshToken,
    });
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
      activityLogs,
      subscription,
      paymentInfo,
      customFields,
      externalIds,
      isDeactivated,
      deactivationReason,
      userSettings,
      refreshToken,
      verificationCodeExpires,
      verificationTokenExpires,
      securityQuestions,
      apiKeys,
      oauthTokens,
      ratings,
      feedbackProvided,
      loginHistory,
      dataSharingPreferences,
      termsAgreement,
      followers,
      following,
      likedPosts,
      savedPosts,
      blockedUsers,
      badges,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate random username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      const randomNum = Math.floor(Math.random() * 100000000000); // Generate a random number between 0 and 999
      finalUsername = lastName
        ? `${firstName}_${lastName}${randomNum}`
        : `${firstName}${randomNum}`;

      // Ensure the generated username is unique
      while (await User.findOne({ username: finalUsername })) {
        const newRandomNum = Math.floor(Math.random() * 100000000000);
        finalUsername = lastName
          ? `${firstName}_${lastName}${newRandomNum}`
          : `${firstName}${newRandomNum}`;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username: finalUsername,
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
      refreshToken,
      verificationCodeExpires,
      verificationTokenExpires,
      apiKeys,
      oauthTokens,
      ratings,
      feedbackProvided,
      loginHistory,
      dataSharingPreferences,
      termsAgreement,
      followers,
      following,
      likedPosts,
      savedPosts,
      blockedUsers,
      badges,
    });

    const user = await newUser.save();
    const { accessToken, refreshToken: generatedRefreshToken } =
      generateTokens(user);
    const cookieOptions = getCookieOptions(req);
    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", generatedRefreshToken, cookieOptions);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        email: user.email,
        username: user.username, // Include the generated username in the response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields = [
      "firstName",
      "lastName",
      "username",
      "email",
      "profilePicture",
      "bio",
      "skills",
      "address",
      "phone",
      "website",
      "dateOfBirth",
      "gender",
    ];

    updatedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
