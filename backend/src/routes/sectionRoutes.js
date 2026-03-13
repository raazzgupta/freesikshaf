const express = require('express');
const router = express.Router();
const { createSection, getSections, deleteSection } = require('../controllers/sectionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('teacher', 'admin'), createSection);
router.get('/:courseId', getSections);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteSection);

module.exports = router;
