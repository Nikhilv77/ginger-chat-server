import userModel from '../Models/UserModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nykhilverma@gmail.com",
    pass: "xrektseciylzhysw",
  },
});
// helpers/images.js
const isAbsoluteUrl = (v = "") => /^https?:\/\//i.test(v);

export const toSupabasePublicUrl = (val) => {
  if (!val) return val;                 // null/undefined/"" -> keep as is
  if (isAbsoluteUrl(val)) return val;   // already a URL -> keep
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${encodeURIComponent(val)}`;
};

export const updatePassword = async(req,res)=>{
  const{email} = req.body;
  const {password} = req.body;
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password,salt);
  try {
    const updatedUser = await userModel.findOneAndUpdate({email:email},{password:encryptedPassword},{new:true});
    res.status(200).json({updatedUser});
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const signup = async (req, res) => {
  const { userName, password, email, name, city, about, image } = req.body;

  const emailLowerCase = (email || '').toLowerCase().trim();
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email: emailLowerCase }, { userName }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Normalize the incoming image (filename -> Supabase public URL)
    const normalizedPicture =
      image === '' || image == null ? null : toSupabasePublicUrl(image);

    const newUser = new userModel({
      email: emailLowerCase,
      name,
      userName,
      password: encryptedPassword,
      profilePicture: normalizedPicture, // <-- save URL or null
      residence: city,
      about,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      { userName: savedUser.userName, id: savedUser._id },
      process.env.JWTSECRETKEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ savedUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async(req,res)=>{
  const{email,password} = req.body;
  let emailLowerCase = email.toLowerCase();
 try {
  const savedUser = await userModel.findOne({email:emailLowerCase});
  if(savedUser){
    const isPasswordCorrect = await bcrypt.compare(password,savedUser.password);
    if(!isPasswordCorrect){
res.status(400).json({message:'Password is incorrect!'})
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
export const userVerification = async(req,res)=>{
  const otp = req.body.oneTimePassword;
  const userEmail = req.body.email;
  const mailOptions = {
    from: "nykhilverma@gmail.com",
    to: userEmail,
    subject: "Your OTP verification for GingerChat",
    html: `<div style="width: 80%; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 10px; overflow: hidden;">
   <div style="background-color: #007bff; padding: 20px; text-align: center; color: #fff;">
     <h1 style="margin: 0; font-size: 24px;">GingerChat OTP Verification</h1>
   </div>
 
   <div style="background-color: #ffffff; padding: 20px;">
     <p style="margin-bottom: 15px; font-size: 16px;">Your one-time password is: <strong style="color: #28a745; font-size: 1.2em;">${otp}</strong></p>
     <p style="margin-bottom: 15px; font-size: 16px;">This OTP is valid for a short period. Do not share it with anyone.</p>
     <p style="font-size: 16px;">If you did not request this OTP, please ignore this email.</p>
   </div>
 
 </div>`,
  };

  try {
    await transportMail.sendMail(mailOptions);
    res.status(200).json(otp);
  } catch (error) {
    res.status(400).json({ message: "OTP Could not be sent" });
  }
}