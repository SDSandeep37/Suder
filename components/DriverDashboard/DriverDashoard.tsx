"use client";

import { useUserContext } from "@/Context";
import { useEffect, useState } from "react";
import "./driverDashboard.css";
import Link from "next/link";

const DriverDashboard = () => {
  const { userData } = useUserContext();
  const [isOnline, setIsOnline] = useState(true);
  const [totalRides,setTotalRides] = useState(0);
  const [todayRides, setTodayRides] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeRides,setActiveRides] = useState(0);
  const [recentTrips,setRecentTrips] =  useState([]);
  const [availableRides,setAvailableRides] = useState(0);
  const [driverRides,setDriverRides] = useState(0);

  // getting recent rides
  useEffect(()=>{
    const fetchRecentRides = async ()=>{
      if(!userData?.id) return;
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}rides/${userData.id}/driver/recent`
        );
        const rides  =  await result.json();
        setRecentTrips(rides);
      } catch (error) {
        console.error("Error occured while fetching the total rides and details",error);
      }
    };
    fetchRecentRides();
  },[userData]);

  // getting the details for the dashboard
  useEffect(() => {
    const fetchRidesDetailsForDashboard = async () => {
      if (!userData?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}rides/${userData.id}/driver/dashboard`
        );

        const data = await res.json();
        setTotalRides(() =>data.total_rides?data.total_rides:0)
        setTodayRides(()=> data.today_rides?data.today_rides:0);
        setCompletedRides(()=>data.completed_rides?data.completed_rides:0);
        setTotalEarnings(()=>data.today_earnings?data.today_earnings:0)
        setActiveRides(()=>data.active_rides?data.active_rides:0)
      } catch (error) {
        console.error("Failed to fetch today's rides:", error);
      }
    };

    fetchRidesDetailsForDashboard();
  }, [userData]);

  // Getting available and driver's rides
  useEffect(() =>{
    const getAvailableAndDriverRides =async () =>{
      if(!userData?.id) return;
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}rides/${userData.id}/driver/all`
        );
        const data =  await result.json();
        setAvailableRides(data.availableRidesCount);
        setDriverRides(data.driverRidesCount);
      } catch (error) {
        console.error("Not to fetch the available and driver's ride",error);
      }
    };
    getAvailableAndDriverRides();
  },[userData])
  return (
    <div className="min-h-screen p-6">
      
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {userData?.first_name}
        </h1>

        {/* <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2 rounded-lg text-white ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard view={true} type="availableRides" title="Available Rides" value={availableRides.toString()}/>
        <StatCard view={true} type="myrides" title="Your Rides" value={driverRides.toString()}/>
        <StatCard view={false} type="" title="Total Rides" value={totalRides.toString()} />
        <StatCard view={false} type="" title="Today's Rides" value={todayRides.toString()} />
        <StatCard view={false} type="" title="Completed Rides" value={completedRides.toString()} />
        
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Active Ride */}
        <div className="activeRides p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Active Ride</h2>
          <p>{activeRides}</p>
        </div>

        {/* Earnings */}
        <div className="earnings p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Earnings</h2>
          <p className="text-2xl font-bold text-green-600">{totalEarnings.toString()}</p>
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
            {recentTrips && recentTrips.map((trips:any) => {
              return (
                <tr key={trips.id} className="border-b">
                  <td className="p-2">{trips.first_name} {trips.last_name}</td>
                  <td className="p-2">{trips.pickuppoint?trips.pickuppoint:"No mentioned"}</td>
                  <td className="p-2">{trips.droppoint?trips.droppoint:"No mentioned"}</td>
                  <td className="p-2">{trips.fare?trips.fare:0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const StatCard = ({ title, value,view,type}: { title: string; value: string,view:boolean,type:string }) => {
  return (
    <div className="statCard p-6 rounded-xl shadow flex flex-col justify-center gap-1">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
      {view &&
      <Link href={`/dashboard/ride_details?type=${type}`}>
        <button className="bg-blue-500 text-white px-3 py-1 roundeds">
          View
        </button>
      </Link>}
    </div>
  );
};

export default DriverDashboard;