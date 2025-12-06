import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Get all categories
 */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
