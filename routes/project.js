const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Public routes
router.get("/feed", projectController.getFeedProjects);

// authMiddlewareed routes
// Project Creation
router.post("/", authMiddleware, projectController.createProject);

// Project Retrieval
router.get("/", authMiddleware, projectController.getAllProjects);
router.get("/filter", authMiddleware, projectController.filterProjects);
router.get("/search", authMiddleware, projectController.searchProjects);
router.get("/me", authMiddleware, projectController.getUserProjectsFromToken);
router.get("/trending", authMiddleware, projectController.getTrendingProjects);
router.get(
  "/date-range",
  authMiddleware,
  projectController.getProjectsByDateRange
);
router.get(
  "/pagination",
  authMiddleware,
  projectController.getProjectsWithPagination
);
router.get("/:id", authMiddleware, projectController.getProjectById);
router.get(
  "/user/:userId",
  authMiddleware,
  projectController.getUserProjectsById
);
router.get("/tags/:tag", authMiddleware, projectController.getProjectsByTag);

// Project Update
router.put("/:id", authMiddleware, projectController.updateProject);

// Project Deletion
router.delete("/:id", authMiddleware, projectController.deleteProject);

// Project Actions (Like, Unlike, Comment, Feedback)
router.patch("/:id/like", authMiddleware, projectController.likeProject);
router.patch("/:id/unlike", authMiddleware, projectController.unlikeProject);
router.post("/:id/comment", authMiddleware, projectController.addComment);
router.post("/:id/feedback", authMiddleware, projectController.addFeedback);

// Team Management
router.patch(
  "/:id/add-team-member",
  authMiddleware,
  projectController.addTeamMember
);
router.patch(
  "/:id/remove-team-member",
  authMiddleware,
  projectController.removeTeamMember
);

// Project Status
router.patch(
  "/:id/assign-status",
  authMiddleware,
  projectController.assignStatus
);

module.exports = router;
