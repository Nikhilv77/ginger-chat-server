import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  chatId:{
    type:String
  },
  senderId:{
    type:String
  },
  text:{
    type:String
  }
},{timestamps:true})

const MessageModel = mongoose.model('MessageModel',MessageSchema);
export default MessageModel