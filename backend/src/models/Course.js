const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true,
  trim:true
 },

 description:{
  type:String,
  required:true
 },

 instructor:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 price:{
  type:Number,
  default:0
 },

 category:String,

 tags:[String],

 thumbnail:String,

 rating:{
  type:Number,
  default:0
 },

 numReviews:{
  type:Number,
  default:0
 },

 studentsCount:{
  type:Number,
  default:0
 },

 isPublished:{
  type:Boolean,
  default:false
 }

},{timestamps:true});

module.exports = mongoose.model("Course",courseSchema);

