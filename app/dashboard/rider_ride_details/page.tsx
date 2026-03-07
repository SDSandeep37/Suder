"use client"
import RideDetailsRider from "@/components/RideDetails/RideDetailsRider";
import { useUserContext } from "@/Context";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

const RiderRidesDetailsMain = () => {
  const searchParams =  useSearchParams();
  const type =  searchParams.get('type');
  const {userData} =  useUserContext();
  const [currentRides, setCurrentRides] =  useState([]);
  const [allRides, setAllRides] =  useState([]);
  const [startedRides, setStartedRides] =  useState([]);
  const [loading, setLoading] = useState(true);
  // fetching all the rides related to the the rider
  useEffect(() => {
    const getAllTheRideDetails = async () =>{
      if(!userData?.id) return;
      try {
         setLoading(true);
        const result =  await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}rides/rider/${userData.id}/all`
        );
        const data =  await result.json();
        setCurrentRides(data.currentRides);
        setAllRides(data.allRides);
        setStartedRides(data.startedRides);
      } catch (error) {
        console.error("Not able to fetch available rides and diver's ride", error);
      }finally{
        setLoading(false);
      }
    }
    getAllTheRideDetails();
  },[userData]);
  if (loading) {
    return <p className="p-6">Loading rides...</p>;
  }
  return (
    <div>
      {type === "all" 
      &&
        <RideDetailsRider user={Number(userData?.id)} type="all" details={allRides}/>
      }
      {type === "current" 
      &&
      <RideDetailsRider user={Number(userData?.id)} type="current" details={currentRides}/>
      }
      {type === "started" 
      &&
      <RideDetailsRider user={Number(userData?.id)} type="started" details={startedRides}/>
      }
    </div>
  )
}

export default RiderRidesDetailsMain