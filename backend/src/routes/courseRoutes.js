const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse } = require('../controllers/courseController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { authorize } = require('../middleware/roleMiddleware.js');

router.route('/')
    .get(getCourses)
    .post(protect, authorize('teacher', 'admin'), createCourse);

router.route('/:id')
    .get(getCourseById);

module.exports = router;
