import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Sidebar from '../Adminpage/Sidebar';
import '../Admincss/AdminLayout.css';



const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ⛔️ Not logged in or not an admin
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="app-wrapper">
      <AdminNavbar isDarkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
      <div className="main-body">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
