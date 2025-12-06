import React, { useState } from "react";
import axios from "axios";
import "./meeting.css";

const ScheduleMeeting = () => {
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const isoTime = new Date(startTime).toISOString(); // 👈 Convert to ISO format
await axios.post("http://localhost:5000/api/zoom/create", {
  topic,
  start_time: new Date(startTime).toISOString(),
  duration,
  host_email: "masoomali8076@gmail.com"
});

    alert("Meeting Scheduled!");
  } catch (error) {
    console.error("Error scheduling meeting:", error.response ? error.response.data : error.message);
    alert("Error scheduling meeting");
  }
};


  return (
    <div className="meeting-container">
      <h2>Schedule Meeting</h2>
      <form className="meeting-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <input type="number" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleMeeting;
