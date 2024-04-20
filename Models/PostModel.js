import mongoose, { mongo } from "mongoose";

const postSchema = mongoose.Schema({
  userId:{type:String,required:true},
  userName:{type:String,required:true},
  image:{type:String,required:true},
  likes:[],
  comments:[],
  description:{type:String,required:true}
},{timestamps:true})
const postModel = mongoose.model('posts',postSchema);
export default postModel;