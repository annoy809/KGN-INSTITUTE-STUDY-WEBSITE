import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import StateCard from "./StateCard";
import axios from "axios";
import StudentMeetings from "./StudentMeetings";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    enrolled: 0,
    active: 0,
    completed: 0,
    wishlist: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [hasUpcomingMeeting, setHasUpcomingMeeting] = useState(false);
  const [isMeetingUnlocked, setIsMeetingUnlocked] = useState(false);
  const meetingsRef = useRef(null);

  // ⭐ GET userId from localStorage (login ke baad store hota hai)
const userData = JSON.parse(localStorage.getItem("user"));
const userId = userData?._id || userData?.id;


  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      setLoadingStats(true);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard/overview/${userId}`
        );

        // ⭐ Map backend → frontend keys
setCounts((prev) => ({
  ...prev,
  enrolled: Number(res.data.enrolledCourses) || 0,
  active: Number(res.data.activeCourses) || 0,
  completed: Number(res.data.completedCourses) || 0,
  wishlist: Number(res.data.wishlist) || 0,
})); 


        setIsMeetingUnlocked(res.data.enrolledCourses > 0);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [userId]);


  // ⭐ Fetch upcoming meetings
  useEffect(() => {
    if (!isMeetingUnlocked) return;

    const fetchMeetings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/zoom/upcoming");
        const data = await res.json();
        setHasUpcomingMeeting(data.meetings?.length > 0);
      } catch (err) {
        console.error("Meeting fetch error:", err);
      }
    };

    fetchMeetings();
    const interval = setInterval(fetchMeetings, 60000);

    return () => clearInterval(interval);
  }, [isMeetingUnlocked]);


  // Scroll
  const scrollToMeetings = () => {
    meetingsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Dashboard Cards
  const dashboardStats = [
    { icon: "📘", title: "Enrolled Courses", value: counts.enrolled },
    { icon: "🎓", title: "Active Courses", value: counts.active },
    { icon: "🏆", title: "Completed Courses", value: counts.completed },
    { icon: "❤️", title: "Wishlist", value: counts.wishlist },
  ];

if (isMeetingUnlocked) {
  dashboardStats.push({
    icon: "🎥",
    title: "Zoom Meetings",
    value: "View Meetings",
    type: "meetings",
    onClick: scrollToMeetings,
    hasNotification: hasUpcomingMeeting, // ✅ red blinking dot
  });
}


  return (
    <div className="dashboard">

      <h2 className="dashboard-title">My Learning Dashboard</h2>

      {loadingStats ? (
        <p className="loading-message">Loading dashboard statistics...</p>
      ) : (
        <>
          <div className="stats-grid">
            {dashboardStats.map((stat, index) => (
              <StateCard key={index} {...stat} />
            ))}
          </div>
          {isMeetingUnlocked && (
            <div className="meetings-section" ref={meetingsRef}>
              <h3 className="meetings-title">👑 Upcoming Zoom Meetings</h3>
              <StudentMeetings />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
