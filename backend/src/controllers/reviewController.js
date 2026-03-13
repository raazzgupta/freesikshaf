
const Review = require("../models/Review");
const Course = require("../models/Course");


// Add review
const addReview = async (req, res) => {

 try {

  const { courseId, rating, comment } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  // check if user already reviewed
  const existingReview = await Review.findOne({
   user: req.user._id,
   course: courseId
  });

  if (existingReview) {
   return res.status(400).json({
    message: "You already reviewed this course"
   });
  }

  const review = await Review.create({
   user: req.user._id,
   course: courseId,
   rating,
   comment
  });

  // recalculate rating
  const reviews = await Review.find({ course: courseId });

  const numReviews = reviews.length;

  const avgRating =
   reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  course.numReviews = numReviews;
  course.rating = avgRating;

  await course.save();

  res.status(201).json(review);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// Get course reviews
const getCourseReviews = async (req, res) => {

 try {

  const reviews = await Review.find({
   course: req.params.courseId
  }).populate("user", "name");

  res.json(reviews);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};


module.exports = {
 addReview,
 getCourseReviews
};

