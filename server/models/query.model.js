import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    practiceArea: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Query", querySchema);