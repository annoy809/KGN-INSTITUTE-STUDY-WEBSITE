import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  start_time: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  join_url: { type: String, required: true },
  start_url: { type: String }, // optional
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

export default mongoose.model("Meeting", meetingSchema);
