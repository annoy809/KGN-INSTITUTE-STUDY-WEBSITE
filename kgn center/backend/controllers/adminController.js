import ActivityLog from "../models/ActivityLog.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Certificate from "../models/Certificate.js";
import bcrypt from "bcryptjs";


/* =================================================================
   👤 PROFILE CONTROLLERS
================================================================= */

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "File missing" });

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.json({ success: true, avatar: updated.avatar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =================================================================
   🔐 CHANGE PASSWORD
================================================================= */

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Enter both passwords" });

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.hasPassword = true;
    await user.save();

    await ActivityLog.create({
      user: req.user.id,
      action: "Changed password",
      timestamp: new Date(),
    });

    res.json({ success: true, message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =================================================================
   📜 CERTIFICATES
================================================================= */

export const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.findAll({
      order: [["issuedAt", "DESC"]],
    });

    res.json({ success: true, certificates: certs });
  } catch (err) {
    console.error("❌ Certificate Fetch Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const issueCertificate = async (req, res) => {
  try {
    const { studentId, courseId, studentName, courseName } = req.body;

    if (!studentId || !courseId || !studentName || !courseName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await Certificate.create({
      studentId,
      courseId,
      studentName,
      courseName,
      issuedAt: new Date(),
    });

    await ActivityLog.create({
      user: "Admin",
      action: `Issued certificate to ${studentName}`,
      timestamp: new Date(),
    });

    res.json({ success: true, message: "Certificate issued!" });
  } catch (err) {
    console.error("❌ Issue Certificate Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =================================================================
   💬 MESSAGING
================================================================= */

export const getMessages = async (req, res) => {
  try {
    const msgs = await Message.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, messages: msgs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const msg = await Message.create({
      text,
      sender: "Admin",
      createdAt: new Date(),
    });

    await ActivityLog.create({
      user: "Admin",
      action: "Sent new message",
      timestamp: new Date(),
    });

    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =================================================================
   📊 ANALYTICS
================================================================= */

export const getAnalytics = async (req, res) => {
  try {
    const users = await User.count();
    const courses = await Course.count();
    const totalRevenue = (await Payment.sum("amount")) || 0;

    res.json({
      success: true,
      stats: {
        users,
        courses,
        totalRevenue,
        revenue: [
          { month: "Jan", amount: 50000 },
          { month: "Feb", amount: 70000 },
          { month: "Mar", amount: 80000 },
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =================================================================
   ⚡ ACTIVITY LOGS
================================================================= */

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      order: [["timestamp", "DESC"]],
    });

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
