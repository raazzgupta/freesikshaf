const express = require('express');
const router = express.Router();
const { askQuestion, answerQuestion, getCourseDiscussions } = require('../controllers/discussionController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { authorize } = require('../middleware/roleMiddleware.js');

router.post('/', protect, askQuestion);
router.post('/:id/answer', protect, authorize('teacher', 'admin'), answerQuestion);
router.get('/:courseId', getCourseDiscussions);

module.exports = router;
