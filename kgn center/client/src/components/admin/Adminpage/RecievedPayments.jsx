import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../Admincss/ReceivedPayments.css";

const ReceivedPayments = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/api/payments/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };

        fetchStats();
    }, []);

    if (!stats) return <div>Loading...</div>;

    // Convert stats.monthlyStats to array format for Recharts
    const chartData = Object.entries(stats.monthlyStats).map(([month, amount]) => ({
        month,
        amount,
    }));

    return (
        <div className="received-payments-container">
            <h2>📊 Payments Dashboard</h2>

            <div className="stats-cards">
                <div className="card">💰 Total Revenue: ₹{stats.totalRevenue.toFixed(2)}</div>
                <div className="card">📦 Total Orders: {stats.totalOrders}</div>
                <div className="card">🧑 Unique Users: {stats.uniqueUsers}</div>
            </div>
            <h3>🧾 Latest Payments</h3>
            <table className="payments-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Amount (₹)</th>
                        <th>Courses</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.data?.slice(0, 10).map((p, idx) => (
                        <tr key={idx}>
                            <td>{p.email}</td>
                            <td>{(p.amount / 100).toFixed(2)}</td>
                            <td>{p.courseIds?.map(c => c.title).join(", ")}</td>
                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>📅 Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="amount" fill="#3f51b5" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReceivedPayments;
