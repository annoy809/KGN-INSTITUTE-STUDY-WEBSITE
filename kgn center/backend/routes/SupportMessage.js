const SupportMessage = require("../models/SupportMessage");

// 📩 CONTACT SUPPORT
router.post("/support", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ msg: "Message cannot be empty" });

    await SupportMessage.create({
      user: req.user._id,
      message
    });

    res.json({ msg: "Support request submitted successfully" });
  } catch (err) {
    console.error("Support error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
