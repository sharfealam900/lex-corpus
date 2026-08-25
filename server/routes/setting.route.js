import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/setting.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getSettings);

router.put(
  "/",
  isAuthenticated,
  isAdmin,
  updateSettings
);

export default router;