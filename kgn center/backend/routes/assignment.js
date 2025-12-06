const express = require("express");
const router = express.Router();
const AssignmentSubmission = require("../models/AssignmentSubmission");

// POST: Submit an assignment
router.post("/submit-assignment", async (req, res) => {
  try {
    const { assignmentId, courseId, name, answer } = req.body;

    if (!assignmentId || !name || !answer) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await AssignmentSubmission.findOne({
      assignmentId,
      name: name.trim().toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({ error: "You have already submitted this assignment." });
    }

    const submission = new AssignmentSubmission({
      assignmentId,
      courseId,
      name: name.trim().toLowerCase(),
      answer,
    });

    await submission.save();
    res.status(200).json({ message: "Assignment submitted successfully." });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ✅ GET: View all submissions (optional filters: assignmentId, courseId, name)
router.get("/submissions", async (req, res) => {
  try {
    const { assignmentId, courseId, name } = req.query;

    const filter = {};
    if (assignmentId) filter.assignmentId = assignmentId;
    if (courseId) filter.courseId = courseId;
    if (name) filter.name = name.trim().toLowerCase();

    const submissions = await AssignmentSubmission.find(filter).sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

module.exports = router;
