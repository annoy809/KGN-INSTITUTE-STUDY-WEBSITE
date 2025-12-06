// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },

    // ⭐ ADD YOUR PROFILE FIELDS HERE
    name: { type: String },
    bio: { type: String },
    dob: { type: Date },
    profession: { type: String },
    skills: { type: String },
    website: { type: String },
    linkedin: { type: String },
    profileImage: { type: String }, // base64 string
      jobTitle: String,        // ⭐ Added
  phone: String,           // ⭐ Added
  location: String,        // ⭐ Added

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
    enrolledCourses: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: "Course" }
  ],

  completedCourses: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: "Course" }
  ],
  tokenVersion: { type: Number, default: 0 }, // ⭐ For logout from all devices

  },
  { timestamps: true }
  
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema); 