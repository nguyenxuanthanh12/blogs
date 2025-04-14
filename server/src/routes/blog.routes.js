const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const BlogController = require('../controllers/blog.controller');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

var upload = multer({ storage: storage });

router.post('/api/create-blog', authUser, upload.single('image'), asyncHandler(BlogController.createBlog));
router.get('/api/get-all-blog', asyncHandler(BlogController.getAllBlog));
router.get('/api/get-blog-user', authUser, asyncHandler(BlogController.getBlogUser));

module.exports = router;
