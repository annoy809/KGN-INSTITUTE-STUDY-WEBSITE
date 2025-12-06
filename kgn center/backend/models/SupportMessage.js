// models/SupportMessage.js
const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String, // stored file URL
      }
    ],
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    adminReply: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
