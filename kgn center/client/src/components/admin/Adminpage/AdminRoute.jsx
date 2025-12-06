// src/components/admin/Adminpage/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "./Adminlayout";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in or not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ User is admin
  return <AdminLayout />;
};

export default AdminRoute;
