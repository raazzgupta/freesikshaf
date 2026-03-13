const Section = require("../models/Section");
const Course = require("../models/Course");


// Create section
const createSection = async (req,res)=>{

 try{

  const { courseId, title } = req.body;

  const course = await Course.findById(courseId);

  if(!course){
   return res.status(404).json({
    message:"Course not found"
   });
  }

  const section = new Section({
   title,
   courseId
  });

  const savedSection = await section.save();

  res.status(201).json(savedSection);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


// Get sections for course
const getSections = async (req,res)=>{

 try{

  const sections = await Section.find({
   courseId:req.params.courseId
  });

  res.json(sections);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


// Delete section
const deleteSection = async (req,res)=>{

 try{

  const section = await Section.findById(req.params.id);

  if(!section){
   return res.status(404).json({
    message:"Section not found"
   });
  }

  await section.deleteOne();

  res.json({
   message:"Section removed"
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


module.exports = {
 createSection,
 getSections,
 deleteSection
};

