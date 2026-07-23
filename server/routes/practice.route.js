import express from "express";

import {
  createPractice,
  getPractices,
  updatePractice,
  deletePractice,
} from "../controllers/practice.controller.js";

// Import your auth middleware if you have one
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Public
router.get("/", getPractices);

// Admin
router.post("/", createPractice);

router.put("/:id", updatePractice);

router.delete("/:id", deletePractice);

export default router;