const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: 'ap-southeast-2'
});

const s3 = new aws.S3();

// Only accepts jpeg and png files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
};

// allows public access for FE rendering and image to be saved as its Date of creation for uniqueness
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'the-curtain-co',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

// looks for image key in the form
const singleUpload = upload.single('image');

module.exports = { singleUpload, s3 };