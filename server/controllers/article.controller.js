import { Article } from "../models/article.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// =============================
// Upload Article Image
// =============================
export const uploadArticleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "lex-corpus/articles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const result = await uploadFromBuffer();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =============================
// Create Article
// =============================
export const createArticle = async (req, res) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      readTime,
      author,
      image,
      published,
    } = req.body;

    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const article = await Article.create({
      title,
      category,
      excerpt,
      content,
      readTime,
      author,
      image,
      published,
    });

    return res.status(201).json({
      success: true,
      message: "Article created successfully.",
      article,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Published Articles
// =============================
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      published: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get 6 Random Articles
// =============================
export const getRandomArticles = async (req, res) => {
  try {
    const articles = await Article.aggregate([
      {
        $match: {
          published: true,
        },
      },
      {
        $sample: {
          size: 6,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Article
// =============================
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Article
// =============================
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article updated successfully.",
      article,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Article
// =============================
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(
      req.params.id
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};