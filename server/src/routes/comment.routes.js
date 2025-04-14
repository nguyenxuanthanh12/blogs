const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const CommentController = require('../controllers/comment.controller');

router.post('/api/create-comment', authUser, asyncHandler(CommentController.createComment));

module.exports = router;
