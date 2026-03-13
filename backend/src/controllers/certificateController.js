const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const crypto = require("crypto");
const { generateCertificate } = require("../services/certificateService");

const createCertificate = async (req, res) => {

 try {

  const { courseId } = req.body;
  const userId = req.user._id;

  if (!courseId) {
   return res.status(400).json({
    message: "Course ID is required"
   });
  }

  const enrollment = await Enrollment.findOne({
   user: userId,
   course: courseId
  });

  if (!enrollment) {
   return res.status(404).json({
    message: "Enrollment not found"
   });
  }

  if (enrollment.progress < 100) {
   return res.status(400).json({
    message: "Course must be completed (100%) to generate certificate"
   });
  }

  const existingCert = await Certificate.findOne({
   user: userId,
   course: courseId
  });

  if (existingCert) {
   return res.status(400).json({
    message: "Certificate already generated",
    certificate: existingCert
   });
  }

  const course = await Course.findById(courseId)
  .populate("instructor", "name");

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  const certificateId = crypto
  .randomBytes(8)
  .toString("hex")
  .toUpperCase();

  const certificateUrl = await generateCertificate(
   req.user.name,
   course.title,
   new Date(),
   certificateId
  );

  const newCertificate = await Certificate.create({
   user: userId,
   course: courseId,
   certificateId,
   certificateUrl,
   instructorName: course.instructor?.name || "Instructor"
  });

  enrollment.certificateIssued = true;
  await enrollment.save();

  res.status(201).json(newCertificate);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};


const getMyCertificates = async (req, res) => {

 try {

  const certificates = await Certificate.find({
   user: req.user._id
  }).populate("course","title");

  res.json(certificates);

 } catch (error) {

  res.status(500).json({
   message: error.message
  });

 }

};

module.exports = {
 createCertificate,
 getMyCertificates
};