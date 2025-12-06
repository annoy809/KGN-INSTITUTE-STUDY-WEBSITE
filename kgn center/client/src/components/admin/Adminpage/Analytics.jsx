import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Adminpage.css";

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/analytics")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="admin-page-container">
      <h1>Analytics Dashboard</h1>

      <div className="chart-container">
        <h3>Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="stats-cards">
        <div className="stat-card">👥 Users: {data.users}</div>
        <div className="stat-card">📚 Courses: {data.courses}</div>
        <div className="stat-card">💸 Revenue: ₹{data.totalRevenue}</div>
      </div>
    </div>
  );
};

export default Analytics;
