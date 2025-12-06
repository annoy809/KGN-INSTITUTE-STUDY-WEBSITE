import express from "express";
import Wishlist from "../models/Wishlist.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET: Get wishlist of logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.find({ userId }).populate("courseId");
    return res.status(200).json({ success: true, wishlist });
  } catch (err) {
    console.error("Wishlist Fetch Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch wishlist" });
  }
});

/**
 * POST: Add course to wishlist
 */
router.post("/add/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if already exists
    const existing = await Wishlist.findOne({ userId, courseId });
    if (existing) {
      return res.status(200).json({ success: false, message: "Course already in wishlist" });
    }

    await Wishlist.create({ userId, courseId });

    // Return updated wishlist
    const updatedWishlist = await Wishlist.find({ userId }).populate("courseId");
    return res.status(201).json({ success: true, message: "Course added to wishlist", wishlist: updatedWishlist });
  } catch (err) {
    console.error("Wishlist Add Error:", err);
    return res.status(500).json({ success: false, message: "Failed to add course to wishlist" });
  }
});

/**
 * DELETE: Remove course from wishlist
 */
router.delete("/remove/:courseId", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const deleted = await Wishlist.findOneAndDelete({ userId, courseId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found in wishlist" });
    }

    const updatedWishlist = await Wishlist.find({ userId }).populate("courseId");
    return res.status(200).json({ success: true, message: "Course removed from wishlist", wishlist: updatedWishlist });
  } catch (err) {
    console.error("Wishlist Remove Error:", err);
    return res.status(500).json({ success: false, message: "Failed to remove course from wishlist" });
  }
});

export default router;
