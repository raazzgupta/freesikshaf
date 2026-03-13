const Course = require("../models/Course");
const Section = require("../models/Section");
const Lecture = require("../models/Lecture");


// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {

 try {

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
   ? {
      title: {
       $regex: req.query.keyword,
       $options: "i"
      }
    }
   : {};

  const count = await Course.countDocuments({
   ...keyword,
   isPublished: true
  });

  const courses = await Course.find({
   ...keyword,
   isPublished: true
  })
   .populate("instructor", "name profileImage")
   .limit(pageSize)
   .skip(pageSize * (page - 1));

  res.json({
   courses,
   page,
   pages: Math.ceil(count / pageSize)
  });

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {

 try {

  const course = await Course.findById(req.params.id)
  .populate("instructor", "name bio profileImage");

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  res.json(course);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = async (req, res) => {

 try {

  const { title, description, price, category, tags, thumbnail } = req.body;

  if (!title || !description) {
   return res.status(400).json({
    message: "Title and description are required"
   });
  }

  const course = new Course({
   title,
   description,
   price,
   category,
   tags,
   thumbnail,
   instructor: req.user._id
  });

  const createdCourse = await course.save();

  res.status(201).json(createdCourse);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher
const updateCourse = async (req, res) => {

 try {

  const course = await Course.findById(req.params.id);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
   return res.status(403).json({
    message: "Not authorized to update this course"
   });
  }

  const { title, description, price, category, tags, thumbnail } = req.body;

  course.title = title || course.title;
  course.description = description || course.description;
  course.price = price || course.price;
  course.category = category || course.category;
  course.tags = tags || course.tags;
  course.thumbnail = thumbnail || course.thumbnail;

  const updatedCourse = await course.save();

  res.json(updatedCourse);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher/Admin
const deleteCourse = async (req, res) => {

 try {

  const course = await Course.findById(req.params.id);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  await course.deleteOne();

  res.json({
   message: "Course removed"
  });

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// @desc    Publish course
// @route   PUT /api/courses/:id/publish
// @access  Private/Teacher
const publishCourse = async (req, res) => {

 try {

  const course = await Course.findById(req.params.id);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  course.isPublished = true;

  await course.save();

  res.json({
   message: "Course published successfully"
  });

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



module.exports = {
 getCourses,
 getCourseById,
 createCourse,
 updateCourse,
 deleteCourse,
 publishCourse
};