const Discussion = require("../models/Discussion");


// Ask question
const askQuestion = async (req,res)=>{

 try{

  const { courseId, question } = req.body;

  const discussion = new Discussion({
   course:courseId,
   student:req.user._id,
   question
  });

  const savedQuestion = await discussion.save();

  res.status(201).json(savedQuestion);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


// Answer question
const answerQuestion = async (req,res)=>{

 try{

  const discussion = await Discussion.findById(req.params.id);

  if(!discussion){
   return res.status(404).json({
    message:"Question not found"
   });
  }

  discussion.answer = req.body.answer;

  await discussion.save();

  res.json(discussion);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


// Get course discussions
const getCourseDiscussions = async (req,res)=>{

 try{

  const discussions = await Discussion.find({
   course:req.params.courseId
  })
  .populate("student","name");

  res.json(discussions);

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};


module.exports = {
 askQuestion,
 answerQuestion,
 getCourseDiscussions
};
