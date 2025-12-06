import React, { useState } from "react";
import axios from "axios";

const ScheduleMeeting = () => {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [meetingLink, setMeetingLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const start_time = new Date(`${date}T${time}`).toISOString();

    const response = await axios.post("/api/zoom/create", {
      topic,
      start_time,
      duration,
    });

    setMeetingLink(response.data.join_url);
  };

  return (
    <div>
      <h2>Schedule Zoom Meeting</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Meeting Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (min)"
          required
        />
        <button type="submit">Create Meeting</button>
      </form>

      {meetingLink && (
        <div>
          <p>Meeting Created ✅</p>
          <a href={meetingLink} target="_blank">Join Link</a>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;
