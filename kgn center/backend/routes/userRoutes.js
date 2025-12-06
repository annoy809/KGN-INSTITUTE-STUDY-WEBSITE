import express from "express";
import multer from "multer";
import path from "path";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// Multer Storage
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads/avatars"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// =========================
// Protected Routes
// =========================
router.use(authMiddleware);

// =========================
// FRONTEND EXPECTS THESE
// =========================

// ✔ GET user profile
router.get("/user/profile", getProfile);

// ✔ UPDATE user profile
router.put("/user/profile", updateProfile);

// ✔ UPLOAD avatar
router.post("/user/upload-avatar", upload.single("avatar"), uploadAvatar);

// ✔ CHANGE password
router.post("/user/change-password", changePassword);

export default router;
