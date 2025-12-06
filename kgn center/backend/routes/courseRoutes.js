// backend/routes/courses.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const slugify = require("slugify");
const Course = require("../models/Course");

/**
 * ✅ Validate ObjectId
 */
const validateObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "❌ Invalid ID format" });
    return false;
  }
  return true;
};

/* -----------------------------------------------------
   🔍 SEARCH ROUTE (NEEDS TO BE AT TOP)
----------------------------------------------------- */
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    const regex = new RegExp(query, "i");

    const courses = await Course.find({
      $or: [
        { title: regex },
        { category: regex },
        { description: regex },
      ]
    });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Search error", error });
  }
});

/* -----------------------------------------------------
   CREATE COURSE
----------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { title, pricingModel } = req.body;

    if (!title || !pricingModel) {
      return res.status(400).json({ error: "❌ 'title' and 'pricingModel' are required." });
    }

    // Normalize payload
    const payload = JSON.parse(JSON.stringify(req.body));
    delete payload._id;
    delete payload.__v;
    delete payload.slug;

    payload.topics = (payload.topics || []).map(topic => ({
      ...topic,
      contents: (topic.contents || []).map(content => {
        if (content.type === "Lesson") {
          return {
            ...content,
            video: content.videoURL || "",
            featuredImage: content.imageURL || "",
          };
        }
        return content;
      })
    }));

    // Unique slug creation
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    payload.slug = slug;

    const newCourse = new Course(payload);
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while creating course." });
  }
});

/* -----------------------------------------------------
   GET ALL COURSES
----------------------------------------------------- */
router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while fetching courses." });
  }
});

/* -----------------------------------------------------
   GET COURSE BY SLUG
----------------------------------------------------- */
router.get("/slug/:slug", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ error: "❌ Course not found by slug." });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while fetching course by slug." });
  }
});

/* -----------------------------------------------------
   PROCESSED COURSE INFO
----------------------------------------------------- */
router.get("/process/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id, res)) return;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "❌ Course not found." });

    res.json({
      courseId: course._id,
      title: course.title,
      duration: course.calculateTotalDuration?.(),
      isLive: course.isActive?.(),
      assessments: course.getAssessments?.(),
      certificate: course.generateCertificateText?.(),
    });
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while processing course." });
  }
});

/* -----------------------------------------------------
   GET COURSE BY ID
----------------------------------------------------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id, res)) return;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "❌ Course not found." });

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while fetching course." });
  }
});

/* -----------------------------------------------------
   UPDATE COURSE
----------------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id, res)) return;

  try {
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ error: "❌ Course not found." });
    }

    const payload = JSON.parse(JSON.stringify(req.body));
    delete payload._id;
    delete payload.__v;
    delete payload.slug;

    if (Array.isArray(payload.topics)) {
      payload.topics = payload.topics.map(topic => ({
        ...topic,
        contents: (topic.contents || []).map(content => {
          if (content.type === "Lesson") {
            return {
              ...content,
              video: content.videoURL || "",
              featuredImage: content.imageURL || "",
            };
          }
          return content;
        }),
      }));
    }

    // regenerate slug if title changed
    if (payload.title && payload.title !== existingCourse.title) {
      let baseSlug = slugify(payload.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await Course.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      payload.slug = slug;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while updating course." });
  }
});

/* -----------------------------------------------------
   DELETE COURSE
----------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id, res)) return;

  try {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "❌ Course not found." });

    res.json({ message: "✅ Course deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "❌ Server error while deleting course." });
  }
});

module.exports = router;
