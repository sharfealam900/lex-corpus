import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";

import {
  createQuery,
  getMyQueries,
  getAllQueries,
  updateQueryStatus,
} from "../controllers/query.controller.js";

const router = express.Router();

// User
router.post("/create", isAuthenticated, createQuery);
router.get("/my", isAuthenticated, getMyQueries);

// Admin
router.get("/all", isAuthenticated, isAdmin, getAllQueries);
router.put("/:id/status", isAuthenticated, isAdmin, updateQueryStatus);

export default router;