

"use client";

import { useUserContext } from "@/Context";
import { useState } from "react";
import "./driverDashboard.css";

const DriverDashboard = () => {
  const { userData } = useUserContext();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen p-6">
      
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {userData?.first_name}
        </h1>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 rounded-lg text-white ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Rides" value="120" />
        <StatCard title="Today's Rides" value="8" />
        <StatCard title="Total Earnings" value="₹ 45,000" />
        <StatCard title="Rating" value="4.8 ⭐" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Active Ride */}
        <div className="activeRides p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Active Ride</h2>
          <p>No active rides currently.</p>
        </div>

        {/* Earnings */}
        <div className="earnings p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Earnings</h2>
          <p className="text-2xl font-bold text-green-600">₹ 1,250</p>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="recentTrips p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Trips</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Passenger</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Fare</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Rahul</td>
              <td>Station</td>
              <td>Airport</td>
              <td>₹ 350</td>
            </tr>
            <tr>
              <td className="py-2">Priya</td>
              <td>Mall</td>
              <td>College</td>
              <td>₹ 180</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="statCard p-6 rounded-xl shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DriverDashboard;