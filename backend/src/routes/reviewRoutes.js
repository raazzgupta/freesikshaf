const express = require('express');
const router = express.Router();
const { addReview, getCourseReviews } = require('../controllers/reviewController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/', protect, addReview);
router.get('/:courseId', getCourseReviews);

module.exports = router;
