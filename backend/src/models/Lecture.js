const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({

 courseId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Course",
  required:true
 },

 sectionId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Section",
  required:true
 },

 title:{
  type:String,
  required:true
 },

 videoUrl:{
  type:String,
  required:true
 },

 duration:{
  type:Number
 },

 order:{
  type:Number
 },

 isPreview:{
  type:Boolean,
  default:false
 },

 resources:[String],

 transcript:String

},{timestamps:true});

module.exports = mongoose.model("Lecture",lectureSchema);