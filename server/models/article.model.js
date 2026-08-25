import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Criminal",
        "Civil",
        "Corporate",
        "Cyber",
        "IP",
        "Taxation",
        "Family",
        "Other",
      ],
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 100000,
    },

    readTime: {
      type: String,
      default: "5 min read",
      trim: true,
      maxlength: 50,
    },

    author: {
      type: String,
      default: "Lex Corpus",
      trim: true,
      maxlength: 100,
    },

    image: {
      url: {
        type: String,
        default: "",
        trim: true,
      },

      publicId: {
        type: String,
        default: "",
        trim: true,
      },
    },

    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({
  published: 1,
  createdAt: -1,
});

const Article = mongoose.model(
  "Article",
  articleSchema
);

export { Article };