import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const router = express.Router();

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// Multer Config
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

// =========================
// Middleware (must login)
// =========================
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, message: "Not authenticated" });
}

// =========================
// GET User Settings
// =========================
router.get("/settings", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email avatar");
    res.json({ success: true, user });
  } catch (err) {
    console.error("Settings fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =========================
// UPDATE User Settings
// =========================
router.put("/settings", isAuthenticated, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, avatar },
      { new: true }
    ).select("name email avatar");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Settings update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =========================
// Avatar Upload
// =========================
router.post("/upload-avatar", isAuthenticated, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    avatar: filePath,
  });
});

export default router;
