import mongoose from "mongoose";
import { Article } from "../models/article.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const MAX_TITLE_LENGTH = 200;
const MAX_EXCERPT_LENGTH = 300;
const MAX_CONTENT_LENGTH = 100000;
const MAX_AUTHOR_LENGTH = 100;
const MAX_READ_TIME_LENGTH = 50;

const allowedCategories = [
  "Criminal",
  "Civil",
  "Corporate",
  "Cyber",
  "IP",
  "Taxation",
  "Family",
  "Other",
];

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
};

const normalizeImage = (image) => {
  if (!image) {
    return {
      url: "",
      publicId: "",
    };
  }

  if (typeof image === "string") {
    return {
      url: image.trim(),
      publicId: "",
    };
  }

  if (typeof image === "object") {
    return {
      url:
        typeof image.url === "string"
          ? image.url.trim()
          : "",
      publicId:
        typeof image.publicId === "string"
          ? image.publicId.trim()
          : "",
    };
  }

  return {
    url: "",
    publicId: "",
  };
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary image delete error:",
      error
    );
  }
};

export const uploadArticleImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const result = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "lex-corpus/articles",
              resource_type: "image",
              transformation: [
                {
                  width: 1600,
                  height: 1000,
                  crop: "limit",
                  quality: "auto",
                  fetch_format: "auto",
                },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(uploadStream);
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(
      "Article image upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload image.",
    });
  }
};

export const createArticle = async (
  req,
  res
) => {
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

    if (
      !title ||
      !category ||
      !excerpt ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, category, excerpt and content are required.",
      });
    }

    if (
      typeof title !== "string" ||
      typeof category !== "string" ||
      typeof excerpt !== "string" ||
      typeof content !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid article data.",
      });
    }

    const cleanTitle = title.trim();
    const cleanCategory =
      category.trim();
    const cleanExcerpt =
      excerpt.trim();
    const cleanContent =
      content.trim();

    const cleanAuthor =
      typeof author === "string"
        ? author.trim()
        : "Lex Corpus";

    const cleanReadTime =
      typeof readTime === "string"
        ? readTime.trim()
        : "5 min read";

    if (
      cleanTitle.length === 0 ||
      cleanTitle.length >
        MAX_TITLE_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid article title.",
      });
    }

    if (
      !allowedCategories.includes(
        cleanCategory
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid article category.",
      });
    }

    if (
      cleanExcerpt.length === 0 ||
      cleanExcerpt.length >
        MAX_EXCERPT_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: `Excerpt must be between 1 and ${MAX_EXCERPT_LENGTH} characters.`,
      });
    }

    if (
      cleanContent.length === 0 ||
      cleanContent.length >
        MAX_CONTENT_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid article content.",
      });
    }

    if (
      cleanAuthor.length >
        MAX_AUTHOR_LENGTH ||
      cleanReadTime.length >
        MAX_READ_TIME_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Author or read time is too long.",
      });
    }

    const parsedPublished =
      parseBoolean(
        published,
        true
      );

    if (parsedPublished === null) {
      return res.status(400).json({
        success: false,
        message:
          "Published must be true or false.",
      });
    }

    const articleImage =
      normalizeImage(image);

    const article =
      await Article.create({
        title: cleanTitle,
        category: cleanCategory,
        excerpt: cleanExcerpt,
        content: cleanContent,
        readTime:
          cleanReadTime || "5 min read",
        author:
          cleanAuthor || "Lex Corpus",
        image: articleImage,
        published: parsedPublished,
      });

    return res.status(201).json({
      success: true,
      message:
        "Article created successfully.",
      article,
    });
  } catch (error) {
    console.error(
      "Create article error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create article.",
    });
  }
};

export const getAllArticles = async (
  req,
  res
) => {
  try {
    const articles =
      await Article.find({
        published: true,
      })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error(
      "Get articles error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch articles.",
    });
  }
};

export const getRandomArticles = async (
  req,
  res
) => {
  try {
    const articles =
      await Article.aggregate([
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
    console.error(
      "Get random articles error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch random articles.",
    });
  }
};

export const getArticleById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article =
      await Article.findOne({
        _id: id,
        published: true,
      }).lean();

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
    console.error(
      "Get article error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch article.",
    });
  }
};

export const getAllAdminArticles = async (
  req,
  res
) => {
  try {
    const articles =
      await Article.find()
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error(
      "Get admin articles error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch articles.",
    });
  }
};

export const updateArticle = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const existingArticle =
      await Article.findById(id);

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

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

    const updateData = {};

    if (title !== undefined) {
      if (
        typeof title !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article title.",
        });
      }

      const cleanTitle =
        title.trim();

      if (
        cleanTitle.length === 0 ||
        cleanTitle.length >
          MAX_TITLE_LENGTH
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article title.",
        });
      }

      updateData.title =
        cleanTitle;
    }

    if (category !== undefined) {
      if (
        typeof category !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article category.",
        });
      }

      const cleanCategory =
        category.trim();

      if (
        !allowedCategories.includes(
          cleanCategory
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article category.",
        });
      }

      updateData.category =
        cleanCategory;
    }

    if (excerpt !== undefined) {
      if (
        typeof excerpt !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article excerpt.",
        });
      }

      const cleanExcerpt =
        excerpt.trim();

      if (
        cleanExcerpt.length === 0 ||
        cleanExcerpt.length >
          MAX_EXCERPT_LENGTH
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article excerpt.",
        });
      }

      updateData.excerpt =
        cleanExcerpt;
    }

    if (content !== undefined) {
      if (
        typeof content !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article content.",
        });
      }

      const cleanContent =
        content.trim();

      if (
        cleanContent.length === 0 ||
        cleanContent.length >
          MAX_CONTENT_LENGTH
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid article content.",
        });
      }

      updateData.content =
        cleanContent;
    }

    if (readTime !== undefined) {
      if (
        typeof readTime !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid read time.",
        });
      }

      const cleanReadTime =
        readTime.trim();

      if (
        cleanReadTime.length >
        MAX_READ_TIME_LENGTH
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid read time.",
        });
      }

      updateData.readTime =
        cleanReadTime;
    }

    if (author !== undefined) {
      if (
        typeof author !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid author.",
        });
      }

      const cleanAuthor =
        author.trim();

      if (
        cleanAuthor.length >
        MAX_AUTHOR_LENGTH
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid author.",
        });
      }

      updateData.author =
        cleanAuthor;
    }

    let newImage = null;
    let imageChanged = false;

    if (image !== undefined) {
      newImage =
        normalizeImage(image);

      if (
        !newImage.url &&
        !newImage.publicId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid image data.",
        });
      }

      updateData.image =
        newImage;

      imageChanged = true;
    }

    if (published !== undefined) {
      const parsedPublished =
        parseBoolean(
          published
        );

      if (parsedPublished === null) {
        return res.status(400).json({
          success: false,
          message:
            "Published must be true or false.",
        });
      }

      updateData.published =
        parsedPublished;
    }

    if (
      Object.keys(updateData).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No fields to update.",
      });
    }

    const article =
      await Article.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (
      imageChanged &&
      existingArticle.image?.publicId &&
      existingArticle.image.publicId !==
        newImage.publicId
    ) {
      await deleteCloudinaryImage(
        existingArticle.image.publicId
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Article updated successfully.",
      article,
    });
  } catch (error) {
    console.error(
      "Update article error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update article.",
    });
  }
};

export const deleteArticle = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article =
      await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const publicId =
      article.image?.publicId || "";

    await Article.findByIdAndDelete(id);

    if (publicId) {
      await deleteCloudinaryImage(
        publicId
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete article error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete article.",
    });
  }
};