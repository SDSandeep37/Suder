import { type SubmitEvent, useState } from "react";
import "./bookride.css";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/utils/geocodeAddress";
import { reverseGeocode } from "@/utils/reverseGeocode";
import { useUserContext } from "@/Context";
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
  return (
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
  )
}

export default BookRide