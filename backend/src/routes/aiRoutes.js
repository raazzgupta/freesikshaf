const express = require('express');
const router = express.Router();
const { getCourseRecommendations } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.get('/recommendations', protect, getCourseRecommendations);

module.exports = router;
