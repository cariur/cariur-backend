const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const uploadController = require("../controllers/uploadController");

// Route for uploading a single file
router.post("/upload", upload.single("file"), uploadController.uploadFile);

module.exports = router;
