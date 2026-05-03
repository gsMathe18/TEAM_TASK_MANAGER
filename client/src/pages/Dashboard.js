import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await API.get("/tasks/dashboard");
        setStats(response.data);
      } catch {
        alert("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Welcome {user?.name}</h2>
        <p className="text-gray-600 mb-4">Role: {user?.role}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-semibold">{stats.total || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-semibold">{stats.completed || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-semibold">{stats.pending || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-xl font-semibold">{stats.inProgress || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center col-span-2 md:col-span-1">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-xl font-semibold">{stats.overdue || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;