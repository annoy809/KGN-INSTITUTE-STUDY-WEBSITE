import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";






dotenv.config();
const router = express.Router();

/* ==========================
   🧩 Meeting Schema (MongoDB)
   ========================== */


/* ==========================
   ⚙️ Get Zoom Access Token
   ========================== */
const getZoomAccessToken = async () => {
  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString("base64"),
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Zoom token error:", err.response?.data || err.message);
    throw new Error("Failed to generate Zoom access token");
  }
};

/* ==========================
   🧩 POST /api/zoom/create
   Create a Zoom Meeting
   ========================== */
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { topic, start_time, duration, host_email } = req.body;

    if (!topic || !start_time || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const accessToken = await getZoomAccessToken();

    const response = await axios.post(
      `https://api.zoom.us/v2/users/${host_email || "me"}/meetings`,
      {
        topic,
        type: 2,
        start_time,
        duration,
        timezone: "Asia/Kolkata",
        settings: {
          join_before_host: true,
          approval_type: 0,
          waiting_room: false,
          mute_upon_entry: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save in DB
    const newMeeting = new Meeting({
      topic: response.data.topic,
      start_time: response.data.start_time,
      duration: response.data.duration,
      join_url: response.data.join_url,
      start_url: response.data.start_url,
    });
    await newMeeting.save();

    /* ======================================================
       🔔 CREATE NOTIFICATION FOR USER
       ====================================================== */
    await Notification.create({
      userId: "all",    // <---- IMPORTANT
      type: "zoom_meeting",
      message: `A Zoom class "${topic}" is scheduled at ${start_time}`,
      isRead: false,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "✅ Meeting created & notification sent",
      meeting: response.data,
    });
  } catch (error) {
    console.error(
      "Zoom create meeting error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create Zoom meeting" });
  }
});


/* ==========================
   🕓 GET /api/zoom/upcoming
   Fetch all meetings (from DB)
   ========================== */
router.get("/upcoming", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ start_time: 1 });
    res.status(200).json({
      message: "Meetings fetched successfully",
      meetings,
    });
  } catch (error) {
    console.error("Zoom upcoming meeting error:", error.message);
    res.status(500).json({ error: "Failed to fetch upcoming meetings" });
  }
});

/* ==========================
   🗑 DELETE /api/zoom/:id
   Delete a meeting from DB (Admin)
   ========================== */
router.delete("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });
    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meeting" });
  }
});

/* ==========================
   📜 GET /api/zoom/history
   Fetch past meetings (ended)
   ========================== */
router.get("/history", async (req, res) => {
  try {
    const now = new Date();

    // Find meetings that have already started (and likely ended)
    const pastMeetings = await Meeting.find({
      start_time: { $lt: now.toISOString() },
    }).sort({ start_time: -1 });

    res.status(200).json(pastMeetings);
  } catch (error) {
    console.error("❌ Zoom history meeting error:", error.message);
    res.status(500).json({ error: "Failed to fetch meeting history" });
  }
});


export default router;
