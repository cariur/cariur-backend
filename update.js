const mongoose = require("mongoose");
const Project = require("./models/Project"); // Update this path to your Project model file
const connectDB = require("./config/db"); // Import the existing DB configuration

// List of possible tags
const possibleTags = [
  "JavaScript",
  "Node.js",
  "React",
  "MongoDB",
  "Express",
  "API",
  "Web Development",
  "Full Stack",
  "Frontend",
  "Backend",
];

// Function to get a random subset of tags
const getRandomTags = (numTags) => {
  const shuffled = possibleTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

// Connect to MongoDB using your existing DB configuration
connectDB().then(async () => {
  try {
    console.log("Connected to MongoDB");

    // Get all projects
    const projects = await Project.find();

    // Update each project with random tags
    for (const project of projects) {
      const numTags = Math.floor(Math.random() * 4) + 1; // Random number of tags between 1 and 4
      const randomTags = getRandomTags(numTags);

      // Update the project with random tags
      await Project.updateOne(
        { _id: project._id },
        { $set: { tags: randomTags } }
      );
    }

    console.log("Tags updated for all projects");
  } catch (err) {
    console.error("Error updating project tags:", err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
});
