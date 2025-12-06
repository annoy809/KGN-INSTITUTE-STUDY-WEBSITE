const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../routes/auth");

// 🔔 Get ALL notifications of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// 🔔 Get count of UNREAD notifications
router.get("/count", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching count" });
  }
});

// 🔔 Mark all notifications as READ
router.put("/mark-read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking as read" });
  }
});

module.exports = router;
