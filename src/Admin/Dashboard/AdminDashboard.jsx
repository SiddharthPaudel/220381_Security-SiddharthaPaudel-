import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from '../../ContextAPI/Auth'
const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalManga: 0,
    totalRents: 0,
    topRented: [],
  });
const { token } = useAuth();
  const fetchDashboardSummary = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/manga/summary",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  return (
    <div className="p-6 font-[Montserrat] bg-[#111] min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-400">Total Manga</p>
          <p className="text-xl font-semibold text-yellow-400">{summary.totalManga}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-xl font-semibold text-yellow-400">{summary.totalUsers}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-400">Total Rents</p>
          <p className="text-xl font-semibold text-yellow-400">{summary.totalRents}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4 text-gray-200">Top Rented Manga</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.topRented}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222",
                border: "none",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: "#2a2a2a" }}
            />
            <Bar dataKey="rented" fill="#facc15" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
