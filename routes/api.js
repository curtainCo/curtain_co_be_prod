// wrapper for all the routes

const express = require('express');
const router = express.Router();
const userRoutes = require('./user_routes');
const authRoutes = require('./auth_routes');
const consultRoutes = require('./consult_routes');
const productRoutes = require('./product_routes');
const collectionRoutes = require('./collection_routes');
const orderRoutes = require('./order_routes');
const { checkAuthenticated, checkAdmin } = require('../middlewares/auth');
const { singleUpload } = require('../config/file_upload');
const { resetPassword } = require('../controllers/users_controllers')

// HOME PAGE
router.get('/', (req, res) => {
  let userObj = null;
  if (req.user) {
    userObj = { ...req.user._doc };
    let expiry = req.session.cookie._expires;
    expiry = new Date(expiry);
    userObj.cookie = expiry.getTime() - Date.now();
    delete userObj.password;
  }
  else {
    userObj = null;
  }

  res.status(200).json({ welcome_message: 'Hello World!', user: userObj });
});


router.use("/account", authRoutes);
router.use("/users", checkAuthenticated, userRoutes);
router.use("/consults", consultRoutes);
router.use("/products", productRoutes);
router.use("/collections", collectionRoutes);
router.use("/orders", checkAuthenticated, orderRoutes);


// Route for uploads to S3
router.post('/upload', checkAuthenticated, checkAdmin, (req, res) => {
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).json({ message: 'File Upload Error', error: err.message });
    }
    res.status(201).json({ 'image': req.file });
  });
});

// Route for forgot password email service
router.post('/forgot-password', resetPassword);


module.exports = router;