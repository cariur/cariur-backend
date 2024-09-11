const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const { swaggerUi, specs } = require("./swagger");
const { protect } = require("./middlewares/authMiddleware");

const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

dotenv.config();

connectDB();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey", // Use environment variable or default
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
