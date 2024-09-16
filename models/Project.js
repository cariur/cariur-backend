const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  // Basic Project Information
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Social Features
  views: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  stars: {
    type: Number,
    default: 0,
  },

  // feedback likes comments
  feedback: [feedbackSchema],
  likes: [likeSchema],
  comments: [commentSchema],

  // Project Status and Versioning
  version: {
    type: String,
    default: "v1.0",
  },
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Abandoned", "Released"],
    default: "In Progress",
  },
  completionDate: {
    type: Date,
  },
  timeToComplete: {
    type: Number, // in hours
  },

  // Media and URLs
  liveDemoUrl: {
    type: String,
  },
  repositoryUrl: {
    type: String,
  },
  documentationUrl: {
    type: String,
  },
  featuredImage: {
    type: String,
  },
  customDomain: {
    type: String,
  },
  mediaGallery: [
    {
      type: String, // URLs to media assets
    },
  ],

  // Categorization and Metadata
  categories: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  technologiesUsed: [
    {
      type: String,
    },
  ],
  difficultyLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },

  // License and Privacy
  license: {
    type: String,
    default: "MIT",
  },
  isPublic: {
    type: Boolean,
    default: true,
  },

  // Engagement and Collaboration
  downloads: {
    type: Number,
    default: 0,
  },
  collaboratorsGuide: {
    type: String,
  },
  contributors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  projectTasks: [
    {
      task: { type: String },
      status: { type: String, default: "Incomplete" },
    },
  ],

  // Project Milestones
  milestones: [
    {
      title: { type: String },
      description: { type: String },
      dueDate: { type: Date },
      isCompleted: { type: Boolean, default: false },
    },
  ],

  // Sponsorship and Monetization
  funding: {
    amount: { type: Number, default: 0 },
    sponsor: { type: String },
  },
  monetization: {
    hasSubscription: { type: Boolean, default: false },
    subscriptionModel: {
      type: String, // Description of subscription model
    },
  },

  // User Engagement Features
  notifications: [
    {
      message: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  polls: [
    {
      question: { type: String },
      options: [{ type: String }],
      votes: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          option: { type: String },
        },
      ],
    },
  ],

  // SEO and Analytics
  seoSettings: {
    metaDescription: { type: String },
    keywords: [{ type: String }],
  },
  analyticsIntegration: {
    isEnabled: { type: Boolean, default: false },
  },

  // Project Performance and Feedback
  performanceMetrics: {
    loadTime: { type: Number },
    memoryUsage: { type: Number },
  },
  feedbackSurveys: [
    {
      question: { type: String },
      responses: [{ type: String }],
    },
  ],

  // Security and Compliance
  securityAudits: [
    {
      date: { type: Date },
      findings: { type: String },
    },
  ],
  complianceInformation: {
    gdpr: { type: Boolean, default: false },
    hipaa: { type: Boolean, default: false },
  },

  // Blockchain/NFT Features
  nftIntegration: {
    hasNFT: { type: Boolean, default: false },
    nftDetails: { type: String },
  },

  // Roadmap and Future Goals
  roadmap: [
    {
      goal: { type: String },
      estimatedCompletion: { type: Date },
    },
  ],

  // External Integrations and Services
  thirdPartyServices: [
    {
      name: { type: String },
      serviceUrl: { type: String },
    },
  ],
  externalResources: [
    {
      resource: { type: String },
      url: { type: String },
    },
  ],

  // Miscellaneous Features
  pinned: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  achievementBadges: [
    {
      badge: { type: String },
      awardedDate: { type: Date },
    },
  ],
  eventLogs: [
    {
      event: { type: String },
      date: { type: Date },
    },
  ],
  progressBar: {
    completionPercentage: { type: Number, default: 0 },
  },

  // Customizable User Interface
  customizableUI: {
    theme: { type: String },
    layout: { type: String },
  },

  // Testing and Beta Features
  userTestingReports: [
    {
      tester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      feedback: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  betaTesters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // Project History and Changelog
  changelog: [
    {
      version: { type: String },
      changes: { type: String },
      date: { type: Date },
    },
  ],

  // Real-Time Features
  teamChat: [
    {
      message: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],

  // External Monetization Links
  supporterLinks: [
    {
      platform: { type: String },
      url: { type: String },
    },
  ],

  // Leaderboard Features
  leaderboard: [
    {
      position: { type: Number },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number },
    },
  ],

  // Offline Support
  offlineSupport: {
    isSupported: { type: Boolean, default: false },
  },

  // New Fields
  achievements: [
    {
      title: { type: String },
      description: { type: String },
      date: { type: Date },
    },
  ],
  merchandise: [
    {
      itemName: { type: String },
      price: { type: Number },
      url: { type: String },
    },
  ],
  community: [
    {
      name: { type: String },
      description: { type: String },
      link: { type: String },
    },
  ],
  supporters: [
    {
      name: { type: String },
      contribution: { type: String },
    },
  ],
  creativeProcess: [
    {
      stage: { type: String },
      details: { type: String },
      date: { type: Date },
    },
  ],
  tutorials: [
    {
      title: { type: String },
      url: { type: String },
      description: { type: String },
    },
  ],
});
projectSchema.index({ title: "text", description: "text", tags: "text" });
module.exports = mongoose.model("Project", projectSchema);
