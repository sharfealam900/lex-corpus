import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  googleLogin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/logout", logoutUser);

router.get("/profile", isAuthenticated, getProfile);

export default router;