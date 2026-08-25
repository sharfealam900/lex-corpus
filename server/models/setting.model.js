import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: "Lex Corpus",
      trim: true,
    },

    tagline: {
      type: String,
      default: "Legal Solutions You Can Trust",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    aboutTitle: {
      type: String,
      default: "",
      trim: true,
    },

    aboutHeading: {
      type: String,
      default: "",
      trim: true,
    },

    aboutDescription: {
      type: String,
      default: "",
    },

    aboutMission: {
      type: String,
      default: "",
    },

    aboutVision: {
      type: String,
      default: "",
    },

    aboutImage: {
      type: String,
      default: "",
      trim: true,
    },

    aboutExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    aboutCasesWon: {
      type: Number,
      default: 0,
      min: 0,
    },

    aboutHappyClients: {
      type: Number,
      default: 0,
      min: 0,
    },

    aboutExpertLawyers: {
      type: Number,
      default: 0,
      min: 0,
    },

    favicon: {
      type: String,
      default: "",
      trim: true,
    },

    contactEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    googleMap: {
      type: String,
      default: "",
      trim: true,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    heroTitle: {
      type: String,
      default: "Professional Legal Services",
      trim: true,
    },

    heroSubtitle: {
      type: String,
      default:
        "Providing trusted legal advice and representation across India.",
    },

    heroButtonText: {
      type: String,
      default: "Book Consultation",
      trim: true,
    },

    heroButtonLink: {
      type: String,
      default: "/contactUs",
      trim: true,
    },

    metaTitle: {
      type: String,
      default: "Lex Corpus",
      trim: true,
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