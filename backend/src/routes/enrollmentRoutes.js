const express = require('express');
const router = express.Router();
const { enrollInCourse, verifyEnrollmentPayment, getMyEnrollments } = require('../controllers/enrollmentController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/', protect, enrollInCourse);
router.post('/verify-payment', protect, verifyEnrollmentPayment);
router.get('/my-enrollments', protect, getMyEnrollments);

module.exports = router;
