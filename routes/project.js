const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

// Create a new project
router.post("/", protect, projectController.createProject);

// Get all projects
router.get("/", protect, projectController.getAllProjects);

// Get projects for the authenticated user (from bearer token)
router.get("/me", protect, projectController.getUserProjectsFromToken);
router.get("/feed", projectController.getFeedProjects);
router.get("/trending", protect, projectController.getTrendingProjects);

// Get a single project by ID
router.get("/:id", protect, projectController.getProjectById);

// Update a project by ID
router.put("/:id", protect, projectController.updateProject);

// Delete a project by ID
router.delete("/:id", protect, projectController.deleteProject);

// Like a project
router.patch("/:id/like", protect, projectController.likeProject);

// Unlike a project
router.patch("/:id/unlike", protect, projectController.unlikeProject);

// Add a comment to a project
router.post("/:id/comment", protect, projectController.addComment);

// Add feedback to a project
router.post("/:id/feedback", protect, projectController.addFeedback);

// Search for projects
router.get("/search", protect, projectController.searchProjects);

// Filter projects based on criteria
router.get("/filter", protect, projectController.filterProjects);

// Add a team member to a project
router.patch("/:id/add-team-member", protect, projectController.addTeamMember);

// Remove a team member from a project
router.patch(
  "/:id/remove-team-member",
  protect,
  projectController.removeTeamMember
);

// Assign a project status
router.patch("/:id/assign-status", protect, projectController.assignStatus);

// Get projects for a specific user by user ID
router.get("/user/:userId", protect, projectController.getUserProjectsById);

// Get all projects for feed

// Route to get projects based on tags
router.get("/tags/:tag", protect, projectController.getProjectsByTag);

// Route to get projects by date range
router.get("/date-range", protect, projectController.getProjectsByDateRange);

// Route to get projects with pagination
router.get("/pagination", protect, projectController.getProjectsWithPagination);

// Route to get trending projects

module.exports = router;
