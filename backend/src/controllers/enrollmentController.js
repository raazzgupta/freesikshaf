const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Payment = require("../models/Payment");

const {
 createOrder,
 verifyPaymentSignature
} = require("../services/paymentService");


// Enroll in course
const enrollInCourse = async (req, res) => {

 try {

  const { courseId } = req.body;
  const user = req.user;

  if (!courseId) {
   return res.status(400).json({
    message: "Course ID required"
   });
  }

  const course = await Course.findById(courseId);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  const existingEnrollment = await Enrollment.findOne({
   user: user._id,
   course: courseId
  });

  if (existingEnrollment) {
   return res.status(400).json({
    message: "Already enrolled in this course"
   });
  }

  // Paid course
  if (course.price > 0) {

   const receipt = `rcpt_${Date.now()}`;

   const order = await createOrder(
    course.price,
    "INR",
    receipt
   );

   const paymentRecord = await Payment.create({
    user: user._id,
    course: courseId,
    razorpayOrderId: order.id,
    amount: course.price,
    currency: "INR",
    status: "created"
   });

   return res.json({
    message: "Payment required",
    order,
    paymentId: paymentRecord._id
   });

  }

  // Free course
  const enrollment = await Enrollment.create({
   user: user._id,
   course: courseId,
   status: "active"
  });

  user.enrolledCourses.push(courseId);
  await user.save();

  res.status(201).json(enrollment);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// Verify payment
const verifyEnrollmentPayment = async (req, res) => {

 try {

  const {
   razorpayOrderId,
   razorpayPaymentId,
   razorpaySignature,
   courseId
  } = req.body;

  const user = req.user;

  const isValid = verifyPaymentSignature(
   razorpayOrderId,
   razorpayPaymentId,
   razorpaySignature
  );

  if (!isValid) {
   return res.status(400).json({
    message: "Payment verification failed"
   });
  }

  const paymentRecord = await Payment.findOne({
   razorpayOrderId
  });

  if (!paymentRecord) {
   return res.status(404).json({
    message: "Payment record not found"
   });
  }

  paymentRecord.status = "paid";
  paymentRecord.razorpayPaymentId = razorpayPaymentId;
  paymentRecord.razorpaySignature = razorpaySignature;

  await paymentRecord.save();

  const existingEnrollment = await Enrollment.findOne({
   user: user._id,
   course: courseId
  });

  if (existingEnrollment) {
   return res.json({
    message: "Already enrolled"
   });
  }

  const enrollment = await Enrollment.create({
   user: user._id,
   course: courseId,
   status: "active",
   payment: paymentRecord._id
  });

  user.enrolledCourses.push(courseId);
  await user.save();

  res.json({
   message: "Enrollment successful",
   enrollment
  });

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};



// Get my enrollments
const getMyEnrollments = async (req, res) => {

 try {

  const enrollments = await Enrollment
  .find({ user: req.user._id })
  .populate("course","title thumbnail");

  res.json(enrollments);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};


module.exports = {
 enrollInCourse,
 verifyEnrollmentPayment,
 getMyEnrollments
};