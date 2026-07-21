import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/setting.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// ==============================
// Public Route
// ==============================
router.get("/", getSettings);

// ==============================
// Admin Route
// ==============================
router.put("/", isAuthenticated, updateSettings);

export default router;