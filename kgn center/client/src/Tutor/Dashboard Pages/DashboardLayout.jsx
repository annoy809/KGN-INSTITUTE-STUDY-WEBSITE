// DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import "./DashboardLayout.css"; // 👈 new CSS file for layout

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <ProfileCard />
      </aside>

      <main className="dashboard-main">
        <Outlet /> {/* Dashboard.jsx renders here */}
      </main>
    </div>
  );
};

export default DashboardLayout;
