import React from 'react';
import '../Admincss/AdminNavbar.css'; // Assuming you have a CSS file for styling
import { BellIcon, MoonIcon, SunIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const AdminNavbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className="admin-navbar">
      <div className="left">
        <h1 className="title">Admin Panel</h1>
      </div>

      <div className="right">
        <div className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <SunIcon className="icon" /> : <MoonIcon className="icon" />}
        </div>

        <div className="notif">
          <BellIcon className="icon" />
        </div>

        <div className="profile">
          <UserCircleIcon className="icon profile-icon" />
          <span className="admin-name">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
