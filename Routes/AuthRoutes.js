import express from "express";
import { deleteAccount, login, signup } from "../Controllers/AuthController.js";
const router = express.Router();
router.post('/signup',signup);
router.post('/login',login);
router.post('/delete-account',deleteAccount)
export default router;