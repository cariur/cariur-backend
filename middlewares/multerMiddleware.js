const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/awsConfig");
require("dotenv").config();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // Remove 'acl: public-read', since your bucket doesn't support it
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = upload;
