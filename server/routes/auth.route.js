import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  googleLogin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  sendSignupOTP,
  completeSignup,
  resendSignupOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

router.post("/send-signup-otp", sendSignupOTP);
router.post("/complete-signup", completeSignup);
router.post("/resend-signup-otp",resendSignupOTP);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


router.post("/logout", logoutUser);

router.get("/profile", isAuthenticated, getProfile);


export default router;