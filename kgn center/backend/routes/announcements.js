const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement"); // Assuming you have an Announcement model
const protect = require("../middleware/authMiddleware");

// --- Admin-specific routes for verification and management ---

/**
 * 📈 GET all announcements for admin review.
 * GET /api/announcements/admin
 * This route fetches all announcements for the admin panel.
 * It first uses the `protect` middleware, then checks the user's role.
 */
router.get("/admin", protect, async (req, res) => {
  // Check if the authenticated user has the 'admin' role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "❌ Not authorized as an admin" });
  }

  try {
    // Fetch all announcements and sort by creation date descending
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    console.error("❌ Error fetching all announcements:", err);
    res.status(500).json({ error: "❌ Server error while fetching announcements." });
  }
});

/**
 * ✏️ ADMIN EDIT AN ANNOUNCEMENT
 * PUT /api/announcements/admin/:id/edit
 * Allows an admin to edit an announcement, regardless of its status.
 */
router.put("/admin/:id/edit", protect, async (req, res) => {
  // Check if the authenticated user has the 'admin' role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "❌ Not authorized as an admin" });
  }

  const { title, content } = req.body;

  try {
    const announcementId = req.params.id;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      announcementId,
      { title, content, updatedAt: Date.now() },
      { new: true, runValidators: true } // Return the updated document and run Mongoose validators
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    console.log(`✏️ Announcement ${announcementId} updated by admin.`);
    res.status(200).json({
      message: "✅ Announcement updated successfully.",
      announcement: updatedAnnouncement
    });
  } catch (err) {
    console.error("❌ Error updating announcement by admin:", err);
    res.status(500).json({ error: "❌ Server error while updating announcement." });
  }
});

/**
 * 🗑️ ADMIN DELETE AN ANNOUNCEMENT
 * DELETE /api/announcements/admin/:id/delete
 * Allows an admin to delete an announcement, regardless of its status.
 */
router.delete("/admin/:id/delete", protect, async (req, res) => {
  // Check if the authenticated user has the 'admin' role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "❌ Not authorized as an admin" });
  }

  try {
    const announcementId = req.params.id;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(announcementId);

    if (!deletedAnnouncement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    console.log(`🗑️ Announcement ${announcementId} deleted by admin.`);
    res.status(200).json({
      message: "✅ Announcement deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting announcement by admin:", err);
    res.status(500).json({ error: "❌ Server error while deleting announcement." });
  }
});

/**
 * ✅ APPROVE AN ANNOUNCEMENT
 * PUT /api/announcements/:id/approve
 * Allows an admin to change an announcement's status to 'approved'.
 */
router.put("/:id/approve", protect, async (req, res) => {
  // Check if the authenticated user has the 'admin' role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "❌ Not authorized as an admin" });
  }

  try {
    const announcementId = req.params.id;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      announcementId,
      { status: 'approved' },
      { new: true } // Returns the updated document
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    console.log(`✅ Announcement ${announcementId} approved by admin.`);
    res.status(200).json({
      message: "✅ Announcement approved successfully.",
      announcement: updatedAnnouncement
    });
  } catch (err) {
    console.error("❌ Error approving announcement:", err);
    res.status(500).json({ error: "❌ Server error while approving announcement." });
  }
});

/**
 * ❌ REJECT AN ANNOUNCEMENT
 * PUT /api/announcements/:id/reject
 * Allows an admin to change an announcement's status to 'rejected'.
 */
router.put("/:id/reject", protect, async (req, res) => {
  // Check if the authenticated user has the 'admin' role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "❌ Not authorized as an admin" });
  }

  try {
    const announcementId = req.params.id;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      announcementId,
      { status: 'rejected' },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    console.log(`❌ Announcement ${announcementId} rejected by admin.`);
    res.status(200).json({
      message: "❌ Announcement rejected successfully.",
      announcement: updatedAnnouncement
    });
  } catch (err) {
    console.error("❌ Error rejecting announcement:", err);
    res.status(500).json({ error: "❌ Server error while rejecting announcement." });
  }
});

// --- User-facing routes ---
/**
 * 📝 GET PAGINATED ANNOUNCEMENTS CREATED BY THE LOGGED-IN USER
 * GET /api/announcements/my-announcements?page=1&limit=10
 * Fetches announcements with pagination.
 */
router.get("/my-announcements", protect, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const authorId = req.user.id;
    const announcements = await Announcement.find({ author: authorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalAnnouncements = await Announcement.countDocuments({ author: authorId });

    res.status(200).json({
      announcements,
      currentPage: page,
      totalPages: Math.ceil(totalAnnouncements / limit),
      totalAnnouncements,
    });
  } catch (err) {
    console.error("❌ Error fetching user's announcements:", err);
    res.status(500).json({ error: "❌ Server error while fetching your announcements." });
  }
});

/**
 * 🔍 GET A SINGLE ANNOUNCEMENT FOR EDITING
 * GET /api/announcements/:id
 * Fetches a single announcement by ID, ensuring the user is the author.
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    if (announcement.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "❌ Not authorized to view this announcement." });
    }

    res.status(200).json(announcement);
  } catch (err) {
    console.error("❌ Error fetching single announcement:", err);
    res.status(500).json({ error: "❌ Server error while fetching announcement." });
  }
});


/**
 * ✏️ UPDATE AN ANNOUNCEMENT
 * PUT /api/announcements/:id
 * Allows a user to edit their own announcement.
 */
router.put("/:id", protect, async (req, res) => {
  const { title, content, targetCourses, scheduleDate } = req.body;

  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    if (announcement.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "❌ Not authorized to edit this announcement." });
    }
    
    // Allow editing only if the announcement is not yet approved
    if (announcement.status === 'approved') {
      return res.status(400).json({ error: "❌ Approved announcements cannot be edited." });
    }
    
    // Update fields
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.targetCourses = targetCourses || announcement.targetCourses;
    announcement.scheduleDate = scheduleDate || announcement.scheduleDate;
    announcement.updatedAt = Date.now();

    // If an announcement is edited after being submitted/rejected,
    // it should go back to "published" (pending verification).
    if (announcement.status === 'published' || announcement.status === 'rejected') {
        announcement.status = 'published';
    }

    await announcement.save();

    res.status(200).json({
      message: "✅ Announcement updated successfully.",
      announcement,
    });
  } catch (err) {
    console.error("❌ Error updating announcement:", err);
    res.status(500).json({ error: "❌ Server error while updating announcement." });
  }
});

/**
 * 🗑️ DELETE AN ANNOUNCEMENT
 * DELETE /api/announcements/:id
 * Allows a user to delete their own announcement.
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ error: "❌ Announcement not found." });
    }

    if (announcement.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "❌ Not authorized to delete this announcement." });
    }

    // You can add a check here if you want to prevent deletion of approved announcements
    // if (announcement.status === 'approved') {
    //   return res.status(400).json({ error: "❌ Approved announcements cannot be deleted." });
    // }

    await announcement.deleteOne();

    res.status(200).json({ message: "🗑️ Announcement deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting announcement:", err);
    res.status(500).json({ error: "❌ Server error while deleting announcement." });
  }
});

/**
 * ✅ SUBMIT AN ANNOUNCEMENT
 * POST /api/announcements/submit
 * Sets initial status to 'published' (pending).
 */
router.post("/submit", protect, async (req, res) => {
    try {
      const { title, content, targetCourses, scheduleDate } = req.body;
      const authorId = req.user.id;
  
      if (!title || !content || !authorId) {
        return res.status(400).json({ error: "❌ Title, content, and author are required." });
      }
  
      const newAnnouncement = new Announcement({
        title,
        content,
        author: authorId,
        targetCourses,
        scheduleDate: scheduleDate || null,
        // The user's submission is 'published' which means 'pending approval'
        status: 'published',
      });
  
      await newAnnouncement.save();
  
      console.log(`✅ Announcement created by user ${authorId} with status 'published'.`);
      res.status(201).json({
        message: "✅ Announcement submitted successfully for verification.",
        announcement: newAnnouncement
      });
    } catch (err) {
      console.error("❌ Error submitting announcement:", err);
      res.status(500).json({ error: "❌ Server error while submitting announcement." });
    }
  });

module.exports = router;
