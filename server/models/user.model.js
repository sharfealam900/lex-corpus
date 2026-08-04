import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      default: "",
    },

    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImage: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    address: {
      type: String,
      default: "",
    },

    resetOTP: {
    type: String,
},

resetOTPExpire: {
    type: Date,
},


  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;