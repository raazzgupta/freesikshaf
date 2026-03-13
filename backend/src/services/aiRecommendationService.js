const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");


const getRecommendationsForUser = async (
 userId,
 userInterests = [],
 enrolledCourseTags = []
) => {

 try {

  // Combine interests and enrolled course tags
  const combinedTags = [...new Set([
   ...userInterests,
   ...enrolledCourseTags
  ])];

  // Get courses user already enrolled in
  const enrollments = await Enrollment.find({
   user: userId
  });

  const enrolledCourseIds = enrollments.map(e => e.course);

  // Find courses matching interests/tags
  const recommendedCourses = await Course.find({
   tags: { $in: combinedTags },
   _id: { $nin: enrolledCourseIds },
   isPublished: true
  })
  .limit(5)
  .populate("instructor","name");

  return recommendedCourses;

 } catch (error) {

  console.error("AI Recommendation error:", error);

  return [];

 }

};


module.exports = {
 getRecommendationsForUser
};

