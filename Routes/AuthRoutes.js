import express from "express";
import { deleteAccount, login, signup, updatePassword, userVerification } from "../Controllers/AuthController.js";
const router = express.Router();
router.post('/user-verification',userVerification)
router.post('/signup',signup);
router.post('/login',login);
router.post('/delete-account',deleteAccount)
router.put('/update-password',updatePassword)
export default router;