
// Rider's Dashboard

import { type SubmitEvent, useEffect, useState } from "react";
import "./bookride.css";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/utils/geocodeAddress";
import { reverseGeocode } from "@/utils/reverseGeocode";
import { useUserContext } from "@/Context";
import Link from "next/link";
const RideMap = dynamic(
  () => import("../RideMap/RideMap").then((mod) => mod.RideMap),
  { ssr: false }
);
interface Location{
  lat:number,
  lng:number
}
interface RideLocation {
  address: string;
  lat: number;
  lng: number;
}
// component 
const BookRide = () => {
  const {userData} =  useUserContext();
  const id  = userData?.id;
  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");
  const [pickupLocation, setPickupLocation] = useState<RideLocation | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<RideLocation | null>(null);
    // states for geocoding
    const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<Location | null>(null);
    
    const handlePickupFromMap = async (loc: Location) => {
      const address = await reverseGeocode(loc.lat, loc.lng);

      setPickupLocation({
        address: address ?? "",
        lat: loc.lat,
        lng: loc.lng,
      });
      setPickupText(address ?? "");
      setPickupCoords(loc);
    };
    const handleDropoffFromMap = async (loc: Location) => {
      const address = await reverseGeocode(loc.lat, loc.lng);

      setDropoffLocation({
        address: address ?? "",
        lat: loc.lat,
        lng: loc.lng,
      });
      setDropoffText(address ?? "");
      setDropoffCoords(loc);
    };
    /* Input → Map (Geocoding) */
  const handlePickupSearch = async () => {
  if (!pickupText.trim()) return;

  try {
    const coordinates = await geocodeAddress(pickupText);

    setPickupLocation({
      address: pickupText,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
    setPickupCoords(coordinates);
  } catch {
    alert("Pickup location not found");
  }
};

  const handleDropoffSearch = async () => {
  if (!dropoffText.trim()) return;

  try {
    const coordinates = await geocodeAddress(dropoffText);

    setDropoffLocation({
      address: dropoffText,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
    setDropoffCoords(coordinates);
  } catch {
    alert("Dropoff location not found");
  }
};
const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!pickupLocation || !dropoffLocation) {
    alert("Please select pickup and dropoff locations");
    return;
  }
 

  const ridePayload = {
    pickup: {
      pickup_address: pickupLocation.address,
      pickup_lat: pickupLocation.lat,
      pickup_lng: pickupLocation.lng,
    },
    dropoff: {
      dropoff_address: dropoffLocation.address,
      dropoff_lat: dropoffLocation.lat,
      dropoff_lng: dropoffLocation.lng,
    },
    ride_type:'Single Stop',
    rider_id:id
  };

  console.log("Sending to DB:", ridePayload);
  // Sending to DB
  if(ridePayload){
    try{
      const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}rides`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ridePayload),
      });
      if(response.ok){
        const result = await response.json();
        alert("Ride confirmed");
        console.log(result);
      }
    }catch(error){
      console.error("Error creating ride",error);
    }
  }

 
};

  const [totalRides,setTotalRides] = useState(0);
  const [todayRides, setTodayRides] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [activeRides,setActiveRides] = useState(0);
  const [allRides,setAllRides] = useState(0);
  const [completedRides,setCompletedRides] = useState(0);
  const [currentRideCount, setCurrentRideCont] = useState(0);
  const [inProgressRide, setinProgressRide] = useState(0);
// getting the details for the dashboard
  useEffect(() => {
    const fetchRidesDetailsForDashboard = async () => {
      if (!userData?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}rides/rider/${userData.id}/all`
        );

        const data = await res.json();
        const otherRidesCount =  data.otherRidesCount;
        setTotalRides(() =>otherRidesCount.total_rides?otherRidesCount.total_rides:0)
        setTodayRides(()=> otherRidesCount.today_rides?otherRidesCount.today_rides:0);
        setTotalExpenses(()=>otherRidesCount.today_expenses?otherRidesCount.today_expenses:0)
        setActiveRides(()=>otherRidesCount.active_rides?otherRidesCount.active_rides:0)
        setCompletedRides(()=>data.completed_rides?data.completed_rides:0)
        setAllRides(()=>data.allRidesCount?data.allRidesCount:0)
        setCurrentRideCont(()=>data.currentRidesCount?data.currentRidesCount:0)
        setinProgressRide(()=>data.startedRidesCount?data.startedRidesCount:0)
      } catch (error) {
        console.error("Failed to fetch today's rides:", error);
      }
    };

    fetchRidesDetailsForDashboard();
  }, [userData]);


  return (
    <>
    
    <div className="mainContainer">
      <div className="bookrideContainer">
        <h1>Book Your Ride</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="pickupPoint">Pickup Location</label>
              <input id="pickupPoint"
              type='text' placeholder='Enter pickup Location' value={pickupText}
              onChange={(e)=>setPickupText(e.target.value)}/>
              <small>Please click on search button after typing the name</small>
              <button type="button" className="mapSearchButton" onClick={handlePickupSearch}>
              &#128269;
            </button>
            </div>
            <div>
              <label htmlFor="dropofPoint">Dropoff Location</label>
              <input type='text' placeholder='Enter dropoff location' value={dropoffText}
            onChange={(e) => setDropoffText(e.target.value)}/>
             <small>Please click on search button after typing the name</small>
            <button type="button" className="mapSearchButton" onClick={handleDropoffSearch}>
              &#128269;
            </button>
            </div>
            <div>
              <button type="submit">Confirm Ride</button>
            </div>
          </form>
          
      </div>
      <div className="mapContainer">
        <RideMap 
          onPickupSelect={handlePickupFromMap}
          onDropoffSelect={handleDropoffFromMap}
          pickupFromSearch={pickupCoords}
          dropoffFromSearch={dropoffCoords}/>
      </div>
      
    </div>
    <div className="userDashboardOptions mt-3">
        <h1 className="text-center mt-2 mb-2 font-bold text-green-400 text-3xl">Your Dashboard</h1>
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard view={true} type="all" title="All Rides" value={allRides.toString()} />
        <StatCard view={true} type="current" title="Current Rides" value={currentRideCount.toString()}/>
        <StatCard view={true} type="started" title="In progress rides" value={inProgressRide.toString()}/>
        <StatCard view={false} type="" title="Total Rides" value={totalRides.toString()} />
        <StatCard view={false} type="" title="Today's Rides" value={todayRides.toString()} />
        <StatCard view={false} type="" title="Sucessfully Completed Rides" value={completedRides.toString()} />
        
        
      </div>
       {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Active Ride */}
        <div className="activeRides p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Active Ride</h2>
          <p>{activeRides}</p>
        </div>

        {/* Expenses */}
        <div className="earnings p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Expenses</h2>
          <p className="text-2xl font-bold text-green-600">{totalExpenses .toString()}</p>
        </div>
      </div>
    </div>
    </>
  )
}
const StatCard = ({ title, value,view,type}: { title: string; value: string,view:boolean,type:string }) => {
  return (
    <div className="statCard p-6 rounded-xl shadow flex flex-col justify-center gap-1">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
      {view &&
      <Link href={`/dashboard/rider_ride_details?type=${type}`}>
        <button className="bg-blue-500 text-white px-3 py-1 roundeds">
          View
        </button>
      </Link>}
    </div>
  );
};

export default BookRide