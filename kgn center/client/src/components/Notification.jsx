// NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import "./Notifications.css";
import { Calendar, Video, BookOpen, CheckCircle, Bell } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    fetchNotifications();
    markNotificationsRead();
  }, []);

  // 🔥 Fetch notifications safely
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // Always ensure array
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]); // prevent crash
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setNotifications([]); // fallback
    }
  };

  // 🔔 Mark all notifications read
  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/api/notifications/mark-read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Mark Read Error:", err);
    }
  };

  // 🔥 Icons per type
  const getIcon = (type) => {
    switch (type) {
      case "zoom_meeting":
        return <Video size={22} className="notification-icon" />;
      case "zoom_schedule":
        return <Calendar size={22} className="notification-icon" />;
      case "course_update":
        return <BookOpen size={22} className="notification-icon" />;
      case "success":
        return <CheckCircle size={22} className="notification-icon" />;
      default:
        return <Bell size={22} className="notification-icon" />;
    }
  };

  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>

      {notifications.length === 0 ? (
        <div className="no-notification">
          <p>🔔 No notifications found</p>
        </div>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => (
            <li key={n._id} className="notification-item">
              <div className="notification-icon-wrapper">
                {getIcon(n.type)}
              </div>

              <div className="notification-content">
                <p className="message">{n.message}</p>
                <span className="timestamp">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
