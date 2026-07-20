import express from "express";
import {
  createArticle,
  getAllArticles,
  getRandomArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";

import upload from "../middleware/upload.js";
import { uploadArticleImage } from "../controllers/article.controller.js";

const router = express.Router();

// =============================
// Public Routes
// =============================

router.get("/", getAllArticles);

router.get("/random", getRandomArticles);

router.get("/:id", getArticleById);

// =============================
// Admin Routes
// =============================

router.post("/create", isAuthenticated, createArticle);

router.put("/:id", isAuthenticated, updateArticle);

router.delete("/:id", isAuthenticated, deleteArticle);

router.post("/upload-image", isAuthenticated, upload.single("image"),uploadArticleImage);

export default router;