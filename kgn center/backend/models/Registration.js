const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    education: String,
    university: String,
    grade: String,
    passoutDate: String,
    fatherName: String,
    motherName: String,
    fatherOccupation: String,
    aadharNumber: { type: String, required: true },
    marksheetPath: String,
    course: String,
    center: String,
    batch: String,
    cardNumber: String,
    expiry: String,
    cvv: String,

    // ✅ Added fields
    enrolled: {
      type: Boolean,
      default: false, // initially not enrolled
    },
    enrolledBy: {
      type: String,
      default: null, // "admin" or "student"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
