const express = require('express');
const router = express.Router();
const { uploadLecture, getCourseCurriculum, deleteLecture, trackLectureProgress, streamLectureVideo } = require('../controllers/lectureController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { authorize } = require('../middleware/roleMiddleware.js');
const upload = require('../middleware/FileUploadMiddleware.js'); // Assuming this exists or will be created

router.post('/upload', protect, authorize('teacher', 'admin'), upload.single('video'), uploadLecture);
router.get('/curriculum/:courseId', getCourseCurriculum);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteLecture);
router.post('/progress', protect, trackLectureProgress);
router.get('/stream/:id', protect, streamLectureVideo);

module.exports = router;
