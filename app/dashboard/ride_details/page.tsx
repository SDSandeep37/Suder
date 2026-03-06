"use client"
import RideDetails from "@/components/RideDetails/RideDetails";
import { useUserContext } from "@/Context";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

const RidesDetails = () => {
  const searchParams =  useSearchParams();
  const type =  searchParams.get('type');
  const {userData} =  useUserContext();
  const [availableRides, setAvailableRides] =  useState([]);
  const [myRides, setMyRides] =  useState([]);
  const [loading, setLoading] = useState(true);
  // fetching all the rides related to the driver
  useEffect(() => {
    const getAllTheRideDetails = async () =>{
      if(!userData?.id) return;
      try {
         setLoading(true);
        const result =  await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}rides/${userData.id}/driver/all`
        );
        const allRides =  await result.json();
        setAvailableRides(allRides.availableRides);
        setMyRides(allRides.driverRides);
        console.log()
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
      {type === "availableRides" 
      &&
        <RideDetails role="driver" user={Number(userData?.id)} type="available" details={availableRides}/>
      }
      {type === "myrides" 
      &&
      <RideDetails role="driver" user={Number(userData?.id)} type="myrides" details={myRides}/>
      }
    </div>
  )
}

export default RidesDetails