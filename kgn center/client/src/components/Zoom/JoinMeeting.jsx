import React, { useEffect, useState } from "react";
import axios from "axios";
import "./meeting.css";

const StudentMeetings = () => {
  const [meetings, setMeetings] = useState([]);

  // ✅ Filter out expired meetings
  const filterValidMeetings = (allMeetings) => {
    const now = new Date().getTime();
    return allMeetings.filter((meeting) => {
      const startTime = new Date(meeting.start_time).getTime();
      const endTime = startTime + meeting.duration * 60000;
      return endTime > now;
    });
  };

  // ✅ Fetch upcoming meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/zoom/upcoming");
        const valid = filterValidMeetings(res.data.meetings || []);
        setMeetings(valid);
      } catch (err) {
        console.error("Error fetching meetings:", err);
      }
    };

    fetchMeetings();

    const interval = setInterval(() => {
      setMeetings((prev) => filterValidMeetings(prev));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="student-meetings-container">
      <div className="meetings-header">
        <h2 className="student-meetings-title">Upcoming Zoom Meetings</h2>
        <p className="student-meetings-subtitle">
          Check your upcoming meetings and join on time.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div className="no-meetings-box">
          <p>No upcoming meetings right now.</p>
        </div>
      ) : (
        <div className="meetings-grid">
          {meetings.map((m, i) => {
            const meetingTime = new Date(m.start_time).toLocaleString();
            return (
              <div key={i} className="meeting-card">
                <h3 className="meeting-topic">{m.topic}</h3>
                <p className="meeting-time">Date & Time: {meetingTime}</p>
                <p className="meeting-duration">Duration: {m.duration} min</p>
                <a
                  href={m.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-join-btn"
                >
                  Join Meeting
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentMeetings;

