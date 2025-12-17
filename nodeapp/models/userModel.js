// models/userModel.js

const mongoose = require("mongoose");
const Messages = require("./ModelValidationMessages");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, Messages.USER_NAME_REQUIRED],
      trim: true,
    },
    email: {
      type: String,
      required: [true, Messages.USER_EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, Messages.USER_MOBILE_REQUIRED],
      match: [/^[0-9]{10}$/, Messages.USER_MOBILE_INVALID],
    },
    password: {
      type: String,
      required: [true, Messages.USER_PASSWORD_REQUIRED],
      minlength: [6, Messages.USER_PASSWORD_MIN_LENGTH],
    },
    role: {
      type: String,
      enum: ["Entrepreneur", "Mentor"],
      required: [true, Messages.USER_ROLE_REQUIRED],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;