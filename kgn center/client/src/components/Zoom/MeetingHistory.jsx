import React, { useEffect, useState } from "react";
import axios from "axios";
import "./meeting.css";

const MeetingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/zoom/history");
        // Make sure backend returns an array
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        } else if (Array.isArray(res.data.history)) {
          // handle wrapped response
          setHistory(res.data.history);
        } else {
          console.warn("Unexpected response format:", res.data);
          setHistory([]);
        }
      } catch (err) {
        console.error("❌ Error fetching meeting history:", err);
        setError("Failed to load meeting history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="meeting-container">
      <h2>📜 Meeting History</h2>

      {loading ? (
        <p className="loading-state">Loading meeting history...</p>
      ) : error ? (
        <p className="error-state">{error}</p>
      ) : history.length === 0 ? (
        <p className="empty-state">No past meetings found.</p>
      ) : (
        <div className="meeting-list">
          {history.map((m) => (
            <div key={m._id || m.id} className="meeting-card">
              <p className="meeting-topic"><strong>{m.topic || "Untitled Meeting"}</strong></p>
              <p className="meeting-time">
                {m.start_time
                  ? new Date(m.start_time).toLocaleString()
                  : "No start time available"}
              </p>
              {m.duration && <p>Duration: {m.duration} min</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingHistory;
