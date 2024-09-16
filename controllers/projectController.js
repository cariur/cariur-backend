const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Create a new project with the provided data
    const projectData = {
      ...req.body,
      user: req.user._id, // Set the creator as the user
      collaborators: [req.user._id, ...(req.body.collaborators || [])], // Add user._id to collaborators, keeping existing ones
    };

    // Create and save the project
    const project = new Project(projectData);
    await project.save();

    // Respond with the created project
    res.status(201).json(project);
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({
        path: "user",
        select: "firstName lastName email profilePicture", // Select only the required fields
      })
      .populate({
        path: "collaborators",
        select: "firstName lastName email profilePicture", // Select only the required fields
      })
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Like a project
exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the user has already liked the project
    const alreadyLiked = project.likes.some((like) => {
      return like.user?.toString() === userId.toString();
    });

    if (alreadyLiked) {
      return res.status(400).json({ message: "Project already liked" });
    }

    // Add a new like
    project.likes.push({ user: userId });
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error(error); // Add debug logging
    res.status(400).json({ error: error.message });
  }
};

// Unlike a project
exports.unlikeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the like object for the user
    const likeIndex = project.likes.findIndex(
      (like) => like.user.toString() === userId.toString()
    );

    if (likeIndex === -1) {
      // No like found for this user
      return res.status(400).json({ message: "Project not liked yet" });
    }

    // Remove the like
    project.likes.splice(likeIndex, 1);
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error(error); // Add debug logging
    res.status(400).json({ error: error.message });
  }
};

// Add feedback to a project
exports.addFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.feedback.push({
      user: req.user._id,
      feedback, // Ensure this matches the schema field
      date: new Date(),
    });

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a comment to a project
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.comments.push({
      user: req.user._id,
      comment,
      date: new Date(),
    });

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search for projects
exports.searchProjects = async (req, res) => {
  try {
    const { query } = req.query; // Make sure 'query' is coming from the query string

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const projects = await Project.find({
      $text: { $search: query }, // Perform text search in MongoDB
    }).sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while searching for projects",
      error: error.message,
    });
  }
};

// Filter projects based on criteria
// Route: GET /projects/filter?criteria=value
exports.filterProjects = async (req, res) => {
  try {
    const { criteria } = req.query;

    if (!criteria) {
      return res.status(400).json({ message: "Filter criteria is required" });
    }

    // Assuming you want to filter projects based on criteria
    const projects = await Project.find({
      // Apply your filtering logic here
      // Example: Filtering by a field 'category'
      category: criteria,
    }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a team member to a project
exports.addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.collaborators.includes(userId)) {
      project.collaborators.push(userId);
      await project.save();
      res.status(200).json(project);
    } else {
      res.status(400).json({ message: "User is already a team member" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove a team member from a project
exports.removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.collaborators.includes(userId)) {
      project.collaborators = project.collaborators.filter(
        (id) => id.toString() !== userId
      );
      await project.save();
      res.status(200).json(project);
    } else {
      res.status(400).json({ message: "User is not a team member" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Assign a project status
exports.assignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get projects for a specific user by user ID
exports.getUserProjectsById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({
      collaborators: req.params.userId,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get projects for the authenticated user (from bearer token)
exports.getUserProjectsFromToken = async (req, res) => {
  try {
    const user = req.user; // User from auth middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({
      $or: [{ user: user._id }, { collaborators: user._id }],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all projects for feed
exports.getFeedProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).limit(20); // Limit the number for feed
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Dummy handlers for missing functions
exports.getProjectsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const projects = await Project.find({ tags: tag }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProjectsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate) query.createdAt = { $gte: new Date(startDate) };
    if (endDate)
      query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProjectsWithPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const projects = await Project.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalProjects = await Project.countDocuments();
    const totalPages = Math.ceil(totalProjects / limit);

    res.status(200).json({
      projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalProjects,
        limit,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTrendingProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ likes: -1 }) // Sort by the number of likes, descending
      .limit(20); // Limit the number of results

    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
