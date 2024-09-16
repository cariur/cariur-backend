const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.get("/feed", projectController.getFeedProjects);

// Protected routes
// Project Creation
router.post("/", protect, projectController.createProject);

// Project Retrieval
router.get("/", protect, projectController.getAllProjects);
router.get("/filter", protect, projectController.filterProjects);
router.get("/search", protect, projectController.searchProjects);
router.get("/me", protect, projectController.getUserProjectsFromToken);
router.get("/trending", protect, projectController.getTrendingProjects);
router.get("/date-range", protect, projectController.getProjectsByDateRange);
router.get("/pagination", protect, projectController.getProjectsWithPagination);
router.get("/:id", protect, projectController.getProjectById);
router.get("/user/:userId", protect, projectController.getUserProjectsById);
router.get("/tags/:tag", protect, projectController.getProjectsByTag);

// Project Update
router.put("/:id", protect, projectController.updateProject);

// Project Deletion
router.delete("/:id", protect, projectController.deleteProject);

// Project Actions (Like, Unlike, Comment, Feedback)
router.patch("/:id/like", protect, projectController.likeProject);
router.patch("/:id/unlike", protect, projectController.unlikeProject);
router.post("/:id/comment", protect, projectController.addComment);
router.post("/:id/feedback", protect, projectController.addFeedback);

// Team Management
router.patch("/:id/add-team-member", protect, projectController.addTeamMember);
router.patch(
  "/:id/remove-team-member",
  protect,
  projectController.removeTeamMember
);

// Project Status
router.patch("/:id/assign-status", protect, projectController.assignStatus);

module.exports = router;
