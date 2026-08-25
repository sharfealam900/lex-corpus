import mongoose from "mongoose";

const signupOtpSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpire: {
      type: Date,
      required: true,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SignupOTP",
  signupOtpSchema
);