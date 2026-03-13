const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true,
  unique:true,
  lowercase:true,
  trim:true
 },

 password:{
  type:String,
  required:true,
  minlength:6
 },

 role:{
  type:String,
  enum:['student','Trainer','admin'],
  default:'student'
 },

 profileImage:String,

 bio:String,

 interests:[String],

 enrolledCourses:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:'Course'
 }],

 isActive:{
  type:Boolean,
  default:true
 }

},{timestamps:true});

userSchema.pre('save',async function(next){

 if(!this.isModified('password')){
  return next();
 }

 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password,salt);

});

userSchema.methods.matchPassword = async function(enteredPassword){

 return await bcrypt.compare(enteredPassword,this.password);

};

module.exports = mongoose.model('User',userSchema);