exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Return the uploaded file's S3 URL
  res.status(200).json({
    message: "File uploaded successfully",
    fileUrl: req.file.location,
  });
};
