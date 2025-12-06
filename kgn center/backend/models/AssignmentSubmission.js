// models/AssignmentSubmission.js
const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true },
  courseId: { type: String, required: true },
  name: { type: String, required: true },
  answer: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
