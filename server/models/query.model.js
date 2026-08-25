import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    practiceArea: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Resolved",
      ],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

querySchema.index({
  user: 1,
  createdAt: -1,
});

querySchema.index({
  createdAt: -1,
});

const Query = mongoose.model(
  "Query",
  querySchema
);

export default Query;