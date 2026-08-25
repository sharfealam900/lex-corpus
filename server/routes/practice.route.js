import express from "express";

import {
  createPractice,
  getPractices,
  updatePractice,
  deletePractice,
} from "../controllers/practice.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getPractices);

router.post(
  "/",
  isAuthenticated,
  isAdmin,
  createPractice
);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  updatePractice
);

router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  deletePractice
);

export default router;