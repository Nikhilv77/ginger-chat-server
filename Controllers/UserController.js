import userModel from "../Models/UserModel.js"
import bcrypt from 'bcrypt'

export const getAllUsers = async(req,res)=>{
  try {
    const users =await userModel.find();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const getUser = async(req,res)=>{
const id = req.params.id;
try {
  const user = await userModel.findById(id);
  if(user){
    const{password,...otherDetails} = user._doc;
    res.status(200).json(otherDetails)
  }else{
    res.status(404).json({message:"User does not exist"})
  }
} catch (error) {
  res.status(500).json({message:error.message})
}
}

export const sendFriendRequest = async(req,res)=>{
  const {userId,friendId} = req.body;
  console.log(userId,friendId);
try {
  const user = await userModel.findByIdAndUpdate(userId,{$push:{sentRequests:friendId}},{new:true});
 await userModel.findByIdAndUpdate(friendId,{$push:{friendRequests:userId}});
  res.status(200).json({savedUser:user})
} catch (error) {
  res.status(500).json({message:error.message})
}
}
export const undoFriendRequest = async(req,res)=>{
  const {userId,friendId} = req.body;
  console.log(userId,friendId);
try {
  const user = await userModel.findByIdAndUpdate(userId,{$pull:{sentRequests:friendId}},{new:true});
 await userModel.findByIdAndUpdate(friendId,{$pull:{friendRequests:userId}});
  res.status(200).json({savedUser:user})
} catch (error) {
  res.status(500).json({message:error.message})
}
}
export const updateUser = async(req,res)=>{
const id = req.params.id;
const{currentUserId, currentUserAdminStatus,password,userName} = req.body;

if(currentUserId === id || currentUserAdminStatus){
  try {
if(password){
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(password,salt)
}

  const user = await userModel.findByIdAndUpdate(id,req.body,{new:true})
  res.status(200).json(user)
} catch (error) {
  res.status(500).json({message:error.message})
}
}else{
  res.status(403).json({message:`You can not update other user's profile`})
}
}
export const deleteUser = async(req,res)=>{
  const id = req.params.id;
  const{currentUserId,currentUserAdminStatus} = req.body;
  try {
    if(currentUserId === id || currentUserAdminStatus){
      await userModel.findByIdAndDelete(id);
      res.status(200).json({message:'User deleted!'})
    }else{
      res.status(403).json({message:'You can only delete your own account'});
    }
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const followUser = async(req,res)=>{
  const id = req.params.id;
  try {
    const{currentUserId} = req.body;
    if(currentUserId === id){
      res.status(403).json({message:'You can not follow your own profile'})
    }else{
     const toBeFollowedUser = await userModel.findById(id);
     const toBeFollowingUser = await userModel.findById(currentUserId);
     if(!toBeFollowedUser.followers.includes(currentUserId)){
      await toBeFollowedUser.updateOne({$push:{followers:currentUserId}})
      await toBeFollowingUser.updateOne({$push:{followings:id}})
      res.status(200).json({message:'user followed'})
     }else{
      res.status(403).json({message:'You are already following this user'})
     }
    }
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const unfollowUser = async(req,res)=>{
  const id = req.params.id;
  try {
    const {currentUserId} = req.body;
    const toBeUnfollowedUser = await userModel.findById(id);
    const toBeUnfollowingUser = await userModel.findById(currentUserId);
    if(toBeUnfollowedUser.followers.includes(currentUserId)){
      await toBeUnfollowedUser.updateOne({$pull:{followers:currentUserId}})
      await toBeUnfollowingUser.updateOne({$pull : {followings : id}})
      res.status(200).json({message:"user unfollowed successfully!"});
    }else{
      res.status(403).json({message:'You are not following this user'});
    }
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

