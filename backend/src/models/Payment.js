const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

 user:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'User',
  required:true
 },

 course:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'Course',
  required:true
 },

 razorpayOrderId:{
  type:String,
  required:true
 },

 razorpayPaymentId:{
  type:String
 },

 razorpaySignature:{
  type:String
 },

 amount:{
  type:Number,
  required:true
 },

 currency:{
  type:String,
  default:'INR'
 },

 method:{
  type:String
 },

 receipt:{
  type:String
 },

 status:{
  type:String,
  enum:['created','paid','failed'],
  default:'created'
 }

},{timestamps:true});

paymentSchema.index({user:1,course:1,razorpayOrderId:1},{unique:true});

module.exports = mongoose.model('Payment',paymentSchema);