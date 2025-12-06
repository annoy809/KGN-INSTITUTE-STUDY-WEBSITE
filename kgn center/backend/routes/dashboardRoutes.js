import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();

/**
 * GET /api/dashboard/overview/:userId
 */
router.get("/overview/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = user.role?.toLowerCase();

    // ============================
    // STUDENT STATS
    // ============================
    if (userRole === "student") {
      const enrolledCourses = await Enrollment.countDocuments({ user: userId });
      const activeCourses = await Enrollment.countDocuments({
        user: userId,
        status: "active",
      });
      const completedCourses = await Enrollment.countDocuments({
        user: userId,
        status: "completed",
      });

      // ⭐ Wishlist Count for Student
      const wishlistCount = await Wishlist.countDocuments({ userId });

      return res.json({
        role: "student",
        enrolledCourses,
        activeCourses,
        completedCourses,
        wishlist: wishlistCount,
      });
    }

    // ===============================
    // 🎓 INSTRUCTOR / ADMIN STATS
    // ===============================
    let matchQuery = {};
    if (userRole === "instructor") {
      matchQuery = { instructor: userId };
    }

    const totalCourses = await Course.countDocuments(matchQuery);

    const instructorCourses = await Course.find(matchQuery).select("_id");
    const courseIds = instructorCourses.map((c) => c._id);

    const totalStudents =
      courseIds.length > 0
        ? await Enrollment.countDocuments({ course: { $in: courseIds } })
        : 0;

    let totalEarnings = 0;
    if (courseIds.length > 0) {
      const payments = await Payment.aggregate([
        { $match: { course: { $in: courseIds }, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      totalEarnings = payments[0]?.total || 0;
    }

    const activeCourses = await Course.countDocuments({
      ...matchQuery,
      status: "active",
    });

    const completedCourses = await Enrollment.countDocuments({
      course: { $in: courseIds },
      status: "completed",
    });

    // ⭐ Wishlist Count for Instructor & Admin
    const wishlistCount = await Wishlist.countDocuments({ userId });

    res.json({
      role: userRole,
      totalCourses,
      totalStudents,
      totalEarnings,
      activeCourses,
      completedCourses,
      wishlist: wishlistCount, // 🔥 Now included
    });
  } catch (error) {
    console.error("❌ Dashboard API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
