import express from "express";
import {
  getCertificates,
  issueCertificate,
  getMessages,
  sendMessage,
  getAnalytics,
  getActivityLogs,
} from "../controllers/adminController.js";

const router = express.Router();

// Certificates
router.get("/certificates", getCertificates);
router.post("/certificates/issue", issueCertificate);

// Messaging
router.get("/messages", getMessages);
router.post("/messages/send", sendMessage);

// Analytics
router.get("/analytics", getAnalytics);

// Activity Logs
router.get("/activity-logs", getActivityLogs);

export default router;
