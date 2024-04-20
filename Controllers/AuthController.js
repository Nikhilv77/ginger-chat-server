import userModel from '../Models/UserModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const signup = async (req,res)=>{
const {userName,password,email,name} = req.body;
let emailLowerCase = email.toLowerCase();
const salt = await bcrypt.genSalt(10);
const encryptedPassword = await bcrypt.hash(password,salt)

try { 
  const newUser = new userModel({
    email:emailLowerCase,
    name:name, 
    userName:userName,
    password:encryptedPassword,
  })
  const ExistingUser = await userModel.findOne({$or : [{email:emailLowerCase},{userName:userName}]});
  if(ExistingUser){
    return res.status(400).json({message:'User already exists'});
  }
const savedUser =   await newUser.save();
const token = jwt.sign({userName:savedUser.userName, id:savedUser._id},process.env.JWTSECRETKEY,{expiresIn:'1hr'})
  res.status(200).json({savedUser,token})
} catch (error) {
  res.status(500).json({message:error.message})
}
}

export const login = async(req,res)=>{
  const{email,password} = req.body;
  let emailLowerCase = email.toLowerCase();
 try {
  const savedUser = await userModel.findOne({email:emailLowerCase});
  if(savedUser){
    const isPasswordCorrect = await bcrypt.compare(password,savedUser.password);
    if(!isPasswordCorrect){
res.status(400).json({message:'Wrong Password entered'})
    }else{
      const token = jwt.sign({userName:savedUser.userName, id:savedUser._id},process.env.JWTSECRETKEY,{expiresIn:'1hr'})
      res.status(200).json({savedUser,token})
    }
  }else{
    res.status(404).json({message:"User does not exist!"})
  }
 } catch (error) {
  res.status(500).json({message:error.message})
 }
}
export const deleteAccount = async(req, res)=>{
  const {userId} = req.body;
try {
  const user = await userModel.findByIdAndDelete(userId);
  res.status(200).json({message:'Account deleted successfully',user})
} catch (error) {
  res.status(500).json({message:error.message})
}
}
