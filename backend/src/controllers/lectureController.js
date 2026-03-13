const Lecture = require("../models/Lecture");
const Section = require("../models/Section");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");


// @desc    Upload a lecture
// @route   POST /api/lectures/upload
// @access  Private/Teacher
const uploadLecture = async (req, res) => {
    try {

        const { courseId, sectionId, title, duration } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to upload lecture"
            });
        }

        const lecture = new Lecture({
            courseId,
            sectionId,
            title,
            videoUrl: req.file ? req.file.path : "",
            duration
        });

        const savedLecture = await lecture.save();

        res.status(201).json(savedLecture);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get course curriculum (sections + lectures)
// @route   GET /api/lectures/curriculum/:courseId
// @access  Public
const getCourseCurriculum = async (req, res) => {
    try {

        const { courseId } = req.params;

        const sections = await Section.find({ courseId });

        const curriculum = [];

        for (const section of sections) {

            const lectures = await Lecture.find({
                sectionId: section._id
            });

            curriculum.push({
                section,
                lectures
            });
        }

        res.json(curriculum);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private/Teacher
const deleteLecture = async (req, res) => {
    try {

        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            });
        }

        await lecture.deleteOne();

        res.json({
            message: "Lecture removed successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Track lecture progress
// @route   POST /api/lectures/progress
// @access  Private/Student
const trackLectureProgress = async (req, res) => {
    try {

        const { courseId, progress } = req.body;

        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: courseId
        });

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        enrollment.progress = progress;

        await enrollment.save();

        res.json({
            message: "Progress updated",
            progress: enrollment.progress
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Stream lecture video
// @route   GET /api/lectures/stream/:id
// @access  Private
const streamLectureVideo = async (req, res) => {
    try {

        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            });
        }

        res.json({
            videoUrl: lecture.videoUrl
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    uploadLecture,
    getCourseCurriculum,
    deleteLecture,
    trackLectureProgress,
    streamLectureVideo
};

