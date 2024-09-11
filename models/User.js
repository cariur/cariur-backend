const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Information
    // ===========================
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: { type: String, required: false, unique: true },
    password: { type: String, required: false },

    profilePicture: {
      type: String,
      default: "default-profile.png",
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    skills: [{ type: String }],

    // ===========================
    // Address Information
    // ===========================
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },

    // ===========================
    // Contact Information
    // ===========================
    phone: { type: String },
    website: { type: String },

    // ===========================
    // Personal Details
    // ===========================
    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    // ===========================
    // Account Status
    // ===========================
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },

    deactivationReason: { type: String },

    // ===========================
    // Authentication and Security
    // ===========================
    twoFactor: {
      isEnabled: { type: Boolean, default: false },
      secret: { type: String },
    },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },

    loginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },

    securityQuestions: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    // ===========================
    // Roles and Permissions
    // ===========================
    roles: [
      {
        type: String,
        enum: ["user", "moderator", "admin"],
        default: "user",
      },
    ],

    permissions: [{ type: String }],

    // ===========================
    // User Relationships
    // ===========================
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],

    // ===========================
    // Timestamps
    // ===========================
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    lastLogin: { type: Date },
    lastActivity: { type: Date },

    // ===========================
    // Notifications
    // ===========================
    notifications: [
      {
        message: { type: String },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],

    // ===========================
    // Social Media Links
    // ===========================
    socialMedia: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },

    // ===========================
    // Preferences and Settings
    // ===========================
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
    },

    userSettings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
    },

    // ===========================
    // Profile Completion
    // ===========================
    profileCompletion: { type: Number, default: 0 }, // e.g., 0 to 100 percentage

    // ===========================
    // Account Source
    // ===========================
    accountSource: {
      type: String,
      enum: ["web", "mobile", "referral", "other"],
      default: "web",
    },

    // ===========================
    // Tags and Labels
    // ===========================
    tags: [{ type: String }],

    // ===========================
    // Activity Logs
    // ===========================
    activityLogs: [
      {
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // ===========================
    // Subscription and Payment Information
    // ===========================
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "inactive",
      },
      startDate: { type: Date },
      endDate: { type: Date },
    },

    paymentInfo: {
      paymentMethod: {
        type: String,
        enum: ["credit_card", "upi", "bank_transfer"],
        default: "credit_card",
      },
      paymentDetails: { type: String }, // Consider storing only tokenized references
    },

    // ===========================
    // Custom Fields
    // ===========================
    customFields: {
      fieldName1: { type: String },
      fieldName2: { type: Number },
      // Add more custom fields as needed
    },

    // ===========================
    // External IDs
    // ===========================
    externalIds: {
      googleId: { type: String },
      facebookId: { type: String },
      twitterId: { type: String },
    },

    // ===========================
    // Referral Information
    // ===========================
    referrals: {
      referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      referralCode: { type: String },
    },

    // ===========================
    // API and OAuth
    // ===========================
    apiKeys: [
      {
        key: { type: String },
        createdAt: { type: Date, default: Date.now },
        lastUsedAt: { type: Date },
      },
    ],

    oauthTokens: {
      google: { type: String },
      github: { type: String },
    },

    // ===========================
    // Ratings and Feedback
    // ===========================
    ratings: [
      {
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    feedbackProvided: [
      {
        subject: { type: String },
        feedback: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ===========================
    // Login History
    // ===========================
    loginHistory: [
      {
        ip: { type: String },
        device: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // ===========================
    // Data Sharing Preferences
    // ===========================
    dataSharingPreferences: {
      shareWithThirdParties: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
    },

    // ===========================
    // Terms Agreement
    // ===========================
    termsAgreement: {
      agreed: { type: Boolean, default: false },
      agreedAt: { type: Date },
    },
  },
  {
    // Optionally, you can enable automatic timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
