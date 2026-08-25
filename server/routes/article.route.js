import express from "express";

import {
  createArticle,
  getAllArticles,
  getAllAdminArticles,
  getRandomArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  uploadArticleImage,
} from "../controllers/article.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllArticles);

router.get("/random", getRandomArticles);

router.get(
  "/admin/all",
  isAuthenticated,
  isAdmin,
  getAllAdminArticles
);

router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  createArticle
);

router.post(
  "/upload-image",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  uploadArticleImage
);

router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  updateArticle
);

router.delete(
  "/:id",
  isAuthenticated,
  isAdmin,
  deleteArticle
);

router.get("/:id", getArticleById);

export default router;