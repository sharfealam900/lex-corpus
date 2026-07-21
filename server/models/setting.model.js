import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: "Lex Corpus",
    },

    tagline: {
      type: String,
      default: "Legal Solutions You Can Trust",
    },

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    contactEmail: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    googleMap: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    heroTitle: {
      type: String,
      default: "Professional Legal Services",
    },

    heroSubtitle: {
      type: String,
      default:
        "Providing trusted legal advice and representation across India.",
    },

    heroButtonText: {
      type: String,
      default: "Book Consultation",
    },

    heroButtonLink: {
      type: String,
      default: "/contactUs",
    },

    metaTitle: {
      type: String,
      default: "Lex Corpus",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    metaKeywords: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;