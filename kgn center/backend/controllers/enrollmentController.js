import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Check if already enrolled
    const exists = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (exists) {
      return res.status(400).json({ msg: "Already enrolled in this course" });
    }

    // Create enrollment
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      msg: "Successfully Enrolled",
      enrollment: newEnrollment,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Get all enrollments for logged user
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const myEnrollments = await Enrollment.find({ user: userId })
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json(myEnrollments);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Update progress
export const updateProgress = async (req, res) => {
  try {
    const { enrollmentId, progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) return res.status(404).json({ msg: "Enrollment not found" });

    enrollment.progress = progress;
    if (progress >= 100) {
      enrollment.status = "completed";
    } else if (progress > 0) {
      enrollment.status = "in-progress";
    }

    await enrollment.save();

    res.json({ msg: "Progress Updated", enrollment });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};
