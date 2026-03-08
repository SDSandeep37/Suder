import { useEffect, useState } from "react";
import "./rideDetails.css";
import Link from "next/link";

interface RideDetailsPropes{
  type:string,
  user:number,
  details:{
    id:number,
    first_name:string,
    last_name:string,
    status:string,
    pickup_address:string,
    dropoff_address:string,
    email:string,
    mobile:string,
    distance_km:string,
    fare:string
  }[]
}

const RideDetailsRider = ({type,details,user} :RideDetailsPropes) => {
  const [rides, setRides] = useState(details);
  const [loadingRideId, setLoadingRideId] = useState<number | null>(null);
  const [paidRides, setPaidRides] = useState<number[]>([]);
  const [receipts, setReceipts] = useState<{[key:number]:string}>({});
  //loading the details on load of the page
    useEffect(() => {
      setRides(details);
       details.forEach((ride)=>{
    if(ride.status === "COMPLETED"){
      checkPayment(ride.id);
    }
  });
    }, [details]);
    // Handeling all status change poccess using this functio
  const handleRideStatus = async (rideId:number,route:string,) =>{
    //Showing use message while loading
    setLoadingRideId(rideId);
    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}rides/${rideId}/${route}`,
        {
          method:"PUT",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            user_id: user,
          })
        }
      );
      
      if(!response.ok){
        const errorData = await response.json();
        alert(errorData.error || "Failed to cancel ride")
        console.log(`Failed to ${route} ride`, errorData);
      }
       // Update ride status 
    setRides((prev) =>
      prev.map((ride) =>
        ride.id === rideId
          ? { ...ride, status: route==="complete"?route.toUpperCase().concat('D'): route.toUpperCase().concat('ED')}
          : ride
      )
    );

    } catch (error) {
      console.error(`Error ${route}ing ride`,error);
    }finally{
      setLoadingRideId(null); // stop loading
    }
  };
   
    const checkPayment = async (ride_id:number) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}payments/${ride_id}/check`
        );
        if(res.ok){
          const data = await res.json();
          if(data.receipt_url){
            setReceipts(prev => ({
            ...prev,
            [ride_id]: data.receipt_url
            }));
          }
           setPaidRides(prev => [...prev, ride_id]);
        }
       
        
      } catch (error) {
        console.error("Failed to fetch today's rides:", error);
      }
    };

   


  return (
    <div className="rideDetailsMainContianer">
      <h1>{type==="current" ? "Current rides details":
      type==="all"?"All Rides Details":"Your Completed Rides Details"}</h1>
      <div className="overflow-x-auto tableContainer p-3">
      <table className="min-w-full borderdivide-y">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Driver Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Mobile</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Pickup</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Drop</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Distance</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Fare</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rides && rides.length > 0 ? (
            rides.map((detail) => {
              return (
                <tr key={detail.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{detail.first_name} {detail.last_name}</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">{detail.email}</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">{detail.mobile}</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">{detail.pickup_address}</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">{detail.dropoff_address}</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">{detail.distance_km?detail.distance_km:"0"} km</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">₹{detail.fare?detail.fare:"0"}</td>
                  <td className="px-4 py-2 text-sm  text-gray-700">
                    <span className={`px-2 py-1 rounded
                      ${detail.status === "REQUESTED" ? "font-bold text-gray-500" :
                        detail.status === "ACCEPTED" ? "font-bold text-blue-500" :
                        detail.status === "STARTED" ? "font-bold text-yellow-700" :
                        detail.status === "CANCELLED"? "font-bold text-red-700":
                        "font-bold text-green-600"
                        }
                    `}>
                      {detail.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm  text-gray-700">
                    
                      {detail.status==="STARTED" && (
                        <button
                        onClick={()=>handleRideStatus(detail.id,"complete")}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                        {loadingRideId === detail.id ? "Completing..." : "Complete"}
                        </button>
                        
                      )}
                      {(detail.status === "REQUESTED" || detail.status === "ACCEPTED") &&  (
                      <button
                        onClick={()=>handleRideStatus(detail.id,"cancel")}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-1"
                      >
                        {loadingRideId === detail.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                    {detail.status==="COMPLETED" && !paidRides.includes(detail.id) &&(
                      <Link href={`/dashboard/payments?id=${detail.id}&amount=${detail.fare}&user=${user}`}>
                        <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Pay Now
                        </button>
                        </Link>
                      )}
                    {detail.status==="COMPLETED" && paidRides.includes(detail.id) && receipts[detail.id] &&(
                      <a href={receipts[detail.id]} target="_blank">
                        <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Receipt
                        </button>
                        </a>
                      )}
                  </td>
                </tr>
              )
            })
          ):(
          <tr>
            <td colSpan={9} className="text-center py-6 text-gray-500 text-sm">
            No rides available
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default RideDetailsRider