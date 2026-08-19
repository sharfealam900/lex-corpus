import express from "express";

import {
  createPractice,
  getPractices,
  updatePractice,
  deletePractice,
} from "../controllers/practice.controller.js";

const router = express.Router();

// Public
router.get("/", getPractices);

// Admin
router.post("/", createPractice);

router.put("/:id", updatePractice);

router.delete("/:id", deletePractice);

export default router;