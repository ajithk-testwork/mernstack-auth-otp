import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    forgotPassword: {
      type: String,
    },
    forgotPasswordOtp: {
      type: String,
    },
    forgotPasswordOtpExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
