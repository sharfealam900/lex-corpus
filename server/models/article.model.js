import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
    },

    content: {
      type: String,
      required: true,
    },

    readTime: {
      type: String,
      default: "5 min read",
    },

    author: {
      type: String,
      default: "Lex Corpus",
    },

    image: {
      type: String,
      default: "",
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model("Article", articleSchema);