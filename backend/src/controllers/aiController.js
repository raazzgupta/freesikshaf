const { getRecommendationsForUser } = require('../services/aiRecommendationService');
const User = require('../models/User');

const getCourseRecommendations = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
        .populate('enrolledCourses', 'tags category');

        const interests = user.interests || [];

        const enrolledTags = [
            ...new Set(
                user.enrolledCourses.flatMap(course => course.tags || [])
            )
        ];

        const recommendations =
            await getRecommendationsForUser(
                user._id,
                interests,
                enrolledTags
            );

        res.json(recommendations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourseRecommendations };