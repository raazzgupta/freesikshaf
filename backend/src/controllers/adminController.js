const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const bcrypt = require('bcryptjs');


// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();

        const totalRevenueResult = await Payment.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalRevenue =
            totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        res.json({
            users: totalUsers,
            courses: totalCourses,
            enrollments: totalEnrollments,
            revenue: totalRevenue
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find({}).select('-password');

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Register new teacher
// @route   POST /api/admin/teachers
// @access  Private/Admin
const registerTeacher = async (req, res) => {
    try {

        const { name, email, password, bio } = req.body;

        const teacherExists = await User.findOne({ email });

        if (teacherExists) {
            return res.status(400).json({
                message: "Teacher already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const teacher = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
            bio
        });

        res.status(201).json({
            message: "Teacher registered successfully",
            teacher
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
const getTeachers = async (req, res) => {
    try {

        const teachers = await User.find({ role: "teacher" }).select("-password");

        res.json(teachers);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Delete teacher
// @route   DELETE /api/admin/teachers/:id
// @access  Private/Admin
const deleteTeacher = async (req, res) => {
    try {

        const teacher = await User.findById(req.params.id);

        if (!teacher || teacher.role !== "teacher") {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        await teacher.deleteOne();

        res.json({
            message: "Teacher removed successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getAnalytics,
    getAllUsers,
    registerTeacher,
    getTeachers,
    deleteTeacher
};