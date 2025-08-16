import userModel from "../Models/UserModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const getAllUsers = async(req,res)=>{
  try {
    const users =await userModel.find();
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const getFilteredUsers = async(req,res)=>{
  const filter = req.params.filter;
  try {
    const users =await userModel.find();
    const filteredUsers = users.filter((user)=>user.name.toLowerCase().includes(filter.toLowerCase()) || user.userName.toLowerCase().includes(filter.toLowerCase()))
    res.status(200).json(filteredUsers)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const getAllUserNames = async(req, res)=>{
  try {
    const users =await userModel.find();
    const userNames = users.map((user)=>user.userName)
    res.status(200).json(userNames)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const getAllUserIds  = async(req,res)=>{
  try {
    const users =await userModel.find();
    const userIds = users.map((user)=>user._id)
    res.status(200).json(userIds)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
export const getAllUserEmails= async(req, res)=>{

  try {
    const users =await userModel.find();
    const userEmails = users.map((user)=>user.email)
    res.status(200).json(userEmails)
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

export const sendFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId);
    if (user.sentRequests.includes(friendId) && friend.friendRequests.includes(userId)) {
      return res.status(400).json({ message: "Friend request already sent." });
    }
    user.sentRequests.push(friendId);
    await user.save();

    friend.friendRequests.push(userId);
    await friend.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const acceptFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;
 console.log(userId,friendId,'from accept');
  try {
    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId);
    if (user.friends.includes(friendId) && friend.friends.includes(userId)) {
      return res.status(400).json({ message: "already are friends." });
    }
    user.friends.push(friendId);
    user.friendRequests = user.friendRequests.filter((id) => id !== friendId);
    await user.save();

    friend.friends.push(userId);
    friend.sentRequests = friend.sentRequests.filter((id) => id !== userId);
    await friend.save();

    res.status(200).json({ message: "Friendzoned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const declineFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;
console.log(userId,friendId,'from decline');
  try {
    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId);
    if (!user.friendRequests.includes(friendId) && !friend.sentRequests.includes(userId)) {
      return res.status(400).json({ message: "nothing to decline" });
    }
    user.friendRequests = user.friendRequests.filter((id) => id !== friendId);
    await user.save();
    friend.sentRequests = friend.sentRequests.filter((id) => id !== userId);
    await friend.save();

    res.status(200).json({ message: "friend-request declined successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const unfriendUser = async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const user = await userModel.findById(userId);
    const friend = await userModel.findById(friendId);
    if (!user.friends.includes(friendId) && !friend.friends.includes(userId)) {
      return res.status(400).json({ message: "they arent even friends" });
    }
    user.friends = user.friends.filter((id) => id !== friendId);
    await user.save();
    friend.friends = friend.friends.filter((id) => id !== userId);
    await friend.save();

    res.status(200).json({ message: "unfriended-successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateCreatedChat = async (req, res) => {
  const id = req.params.id;

  try {
    const savedUser = await userModel.findOneAndUpdate(
      { _id: id },
      { chatsCreated: true },
      { new: true }
    );

    if (!savedUser) {
    res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(savedUser)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const undoFriendRequest = async(req,res)=>{
  const {userId,friendId} = req.body;
try {
  const user = await userModel.findByIdAndUpdate(userId,{$pull:{sentRequests:friendId}},{new:true});
 await userModel.findByIdAndUpdate(friendId,{$pull:{friendRequests:userId}});
  res.status(200).json({savedUser:user})
} catch (error) {
  res.status(500).json({message:error.message})
}
}
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, userName, residence, about, image } = req.body;

  try {
    let user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (userName) user.userName = userName;
    if (residence) user.residence = residence;
    if (about) user.about = about;

    // ✅ Normalize profile picture input
    // - If `image` is a full URL (Supabase), save it as is
    // - If `image` is a filename/key, convert to public Supabase URL
    // - If `image` is an empty string, clear the picture
    if (image !== undefined) {
      user.profilePicture = image === "" ? null : toSupabasePublicUrl(image);
    }

    user = await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
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

// helpers/images.js (or put at top of your controller file)
const isAbsoluteUrl = (v = "") => /^https?:\/\//i.test(v);

// If `val` is a bare filename/key, convert to Supabase public URL.
// If it’s already a URL, return as-is. If falsy, return as-is.
export const toSupabasePublicUrl = (val) => {
  if (!val || isAbsoluteUrl(val)) return val;
  // Treat `val` as the object key used when uploading to the bucket
  // e.g. "images/1727843445_name.jpg" or just "1727843445_name.jpg"
  const key = encodeURIComponent(val);
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${key}`;
};


// export const followUser = async(req,res)=>{
//   const id = req.params.id;
//   try {
//     const{currentUserId} = req.body;
//     if(currentUserId === id){
//       res.status(403).json({message:'You can not follow your own profile'})
//     }else{
//      const toBeFollowedUser = await userModel.findById(id);
//      const toBeFollowingUser = await userModel.findById(currentUserId);
//      if(!toBeFollowedUser.followers.includes(currentUserId)){
//       await toBeFollowedUser.updateOne({$push:{followers:currentUserId}})
//       await toBeFollowingUser.updateOne({$push:{followings:id}})
//       res.status(200).json({message:'user followed'})
//      }else{
//       res.status(403).json({message:'You are already following this user'})
//      }
//     }
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// }
// export const unfollowUser = async(req,res)=>{
//   const id = req.params.id;
//   try {
//     const {currentUserId} = req.body;
//     const toBeUnfollowedUser = await userModel.findById(id);
//     const toBeUnfollowingUser = await userModel.findById(currentUserId);
//     if(toBeUnfollowedUser.followers.includes(currentUserId)){
//       await toBeUnfollowedUser.updateOne({$pull:{followers:currentUserId}})
//       await toBeUnfollowingUser.updateOne({$pull : {followings : id}})
//       res.status(200).json({message:"user unfollowed successfully!"});
//     }else{
//       res.status(403).json({message:'You are not following this user'});
//     }
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// }

