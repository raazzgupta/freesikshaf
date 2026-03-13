const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({

 course:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Course",
  required:true
 },

 student:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 question:{
  type:String,
  required:true
 },

 answer:{
  type:String,
  default:null
 }

},{timestamps:true});


module.exports = mongoose.model("Discussion",discussionSchema);

