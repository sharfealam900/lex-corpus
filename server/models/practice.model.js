import mongoose from "mongoose";

const practiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    order: {
      type: Number,
      default: 1,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

practiceSchema.index({
  isActive: 1,
  order: 1,
});

const Practice = mongoose.model(
  "Practice",
  practiceSchema
);

export default Practice;