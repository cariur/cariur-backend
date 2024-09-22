const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otpRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { swaggerUi, specs } = require("./swagger");
const cors = require("cors");
const passport = require("passport");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["https://cariur.vercel.app", "http://localhost:3000"],
    credentials: false, // Set to false since we're not using cookies
  })
);

app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api", uploadRoutes);
app.use("/", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/users", userRoutes);
app.use("/projects", projectRoutes);
app.use(otpRoutes);
// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
