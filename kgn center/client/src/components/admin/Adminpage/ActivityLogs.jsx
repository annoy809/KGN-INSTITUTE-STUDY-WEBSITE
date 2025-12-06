import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adminpage.css";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/activity-logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-page-container">
      <h1>Activity Logs</h1>
      <ul className="activity-list">
        {logs.map((log) => (
          <li key={log.id}>
            <strong>{log.user}</strong> — {log.action}
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLogs;
