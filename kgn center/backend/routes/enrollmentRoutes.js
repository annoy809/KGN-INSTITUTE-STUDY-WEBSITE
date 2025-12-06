import express from "express";
import {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
} from "../controllers/enrollmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/enroll", authMiddleware, enrollCourse);
router.get("/my-enrollments", authMiddleware, getMyEnrollments);
router.put("/update-progress", authMiddleware, updateProgress);

export default router;
