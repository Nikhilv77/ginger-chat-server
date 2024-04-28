import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
  isAdmin:{type:Boolean,default:false},
  chatsCreated:{type:Boolean,default:false},
  email :{type:String,required:true},
  name:{type:String,required:true},
  userName:{type:String,required:true},
  password:{type:String,required:true},
  profilePicture:{type:String},
  residence:{type:String},
  about:{type:String},
  friends:[],
  sentRequests:[],
  friendRequests:[],
},{timestamps:true})
const userModel = mongoose.model('users',userSchema);
export default userModel