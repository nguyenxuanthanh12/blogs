const express = require('express');
const router = express.Router();

const { asyncHandler, authUser, authAdmin } = require('../auth/checkAuth');

const TopicController = require('../controllers/topic.controller');

router.post('/api/create-topic', authUser, asyncHandler(TopicController.createTopic));
router.get('/api/get-all-topic', authUser, asyncHandler(TopicController.getAllTopic));

module.exports = router;
