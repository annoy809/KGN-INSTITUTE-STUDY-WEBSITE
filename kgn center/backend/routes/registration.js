const express = require("express");
const multer = require("multer");
const path = require("path");
const Registration = require("../models/Registration");

const router = express.Router();

// ======================= MULTER SETUP =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ======================= REGISTER STUDENT =======================
router.post("/register", upload.single("marksheet"), async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, education, university, grade, passoutDate,
      fatherName, motherName, fatherOccupation, aadharNumber, course, center,
      batch, cardNumber, expiry, cvv
    } = req.body;

    if (!email || !aadharNumber) {
      return res.status(400).json({
        success: false,
        message: "Email and Aadhar number are required.",
      });
    }

    // Duplicate check (email or Aadhar)
    const existing = await Registration.findOne({
      $or: [{ email }, { aadharNumber }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already registered.",
      });
    }

    const registration = new Registration({
      firstName,
      lastName,
      email,
      phone,
      education,
      university,
      grade,
      passoutDate,
      fatherName,
      motherName,
      fatherOccupation,
      aadharNumber,
      marksheetPath: req.file ? req.file.path : null,
      course,
      center,
      batch,
      cardNumber,
      expiry,
      cvv,
    });

    await registration.save();
    return res
      .status(201)
      .json({ success: true, message: "Registration successful." });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ======================= GET ALL REGISTRATIONS =======================
// ======================= GET ALL REGISTRATIONS =======================
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    // ✅ Add default Admin entry automatically
    const admin = {
      _id: "admin-auto-entry",
      firstName: "Admin",
      lastName: "",
      email: "admin@system.com",
      phone: "—",
      course: "Admin Access",
      center: "Main Center",
      batch: "Admin Batch",
      education: "N/A",
      university: "N/A",
      grade: "N/A",
      passoutDate: "N/A",
      fatherName: "N/A",
      motherName: "N/A",
      fatherOccupation: "N/A",
      aadharNumber: "N/A",
      marksheetPath: null,
      cardNumber: "N/A",
      expiry: "N/A",
      cvv: "N/A",
      createdAt: new Date(),
      enrolledBy: "system",
    };

    // ✅ Insert admin entry at top (if not already in DB)
    const finalList = [admin, ...registrations];

    res.status(200).json(finalList);
  } catch (error) {
    console.error("❌ Error fetching registrations:", error);
    res.status(500).json({ error: "❌ Failed to fetch registration data" });
  }
});


// ======================= DELETE REGISTRATION =======================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ======================= ADMIN ENROLL STUDENT =======================
router.post("/enroll", async (req, res) => {
  try {
    const { studentId, course, batch, enrolledByAdmin } = req.body;

    const student = await Registration.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Direct enroll (no payment)
    student.course = course;
    student.batch = batch;
    student.enrolled = true;

    // Optional flag: mark who enrolled
    if (enrolledByAdmin) {
      student.enrolledBy = "admin";
    }

    await student.save();

    res.status(200).json({
      message: "✅ Student enrolled successfully (admin override)",
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during manual enroll" });
  }
});

module.exports = router;
