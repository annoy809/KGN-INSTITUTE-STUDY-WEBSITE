import React from "react";
import "../Admincss/Dashboard.css";

const stats = [
  { icon: "📘", label: "Enrolled Courses", value: 0 },
  { icon: "🎓", label: "Active Courses", value: 0 },
  { icon: "🏆", label: "Completed Courses", value: 0 },
  { icon: "🧑‍🎓", label: "Total Students", value: 0 },
  { icon: "📦", label: "Total Courses", value: 0 },
  { icon: "💰", label: "Total Earnings", value: "₹0.00" },
];

const Dashboard = () => {
  return (
    <div className="dashboard-ui-container">
      <div className="dashboard-ui-header">
        <h1 className="dashboard-ui-title">Dashboard</h1>
        <button className="dashboard-ui-btn">+ New Course</button>
      </div>

      <div className="dashboard-ui-grid">
        {stats.map((stat, index) => (
          <div key={index} className="dashboard-ui-card">
            <div className="dashboard-ui-icon">{stat.icon}</div>
            <div className="dashboard-ui-value">{stat.value}</div>
            <div className="dashboard-ui-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
