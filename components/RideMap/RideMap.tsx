"use client";
import "leaflet/dist/leaflet.css";
import { TileLayer, Marker, Popup, useMapEvents, MapContainer } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
// Fix Leaflet marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const MapClickHandler = ({
  pickup,
  dropoff,
  setPickup,
  setDropoff,
  onPickupSelect,
  onDropoffSelect,
}: any) => {
  useMapEvents({
    click(e:any) {
      if (!pickup) {
        setPickup([e.latlng.lat, e.latlng.lng]);
        onPickupSelect?.(e.latlng);
      } else if (!dropoff) {
        setDropoff([e.latlng.lat, e.latlng.lng]);
        onDropoffSelect?.(e.latlng);
      }
    },
  });

  return null; // IMPORTANT
};
interface RideMapProps {
  onPickupSelect?: (loc: { lat: number; lng: number }) => void;
  onDropoffSelect?: (loc: { lat: number; lng: number }) => void;
  pickupFromSearch?: Location | null;
  dropoffFromSearch?: Location | null;
}

interface Location {
  lat: number;
  lng: number;
}
export const RideMap: React.FC<RideMapProps> = ({
  onPickupSelect,
  onDropoffSelect,
  pickupFromSearch,
  dropoffFromSearch
}) => {
  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  /* Search → Marker */
  useEffect(() => {
    if (pickupFromSearch) {
      setPickup([pickupFromSearch.lat, pickupFromSearch.lng]);
    }
  }, [pickupFromSearch]);

  useEffect(() => {
    if (dropoffFromSearch) {
      setDropoff([dropoffFromSearch.lat, dropoffFromSearch.lng]);
    }
  }, [dropoffFromSearch]);

  return (
    <MapContainer
      center={[23.35, 85.33]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapClickHandler
        pickup={pickup}
        dropoff={dropoff}
        setPickup={setPickup}
        setDropoff={setDropoff}
        onPickupSelect={onPickupSelect}
        onDropoffSelect={onDropoffSelect}
      />

      {pickup && (
        <Marker position={pickup}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {dropoff && (
        <Marker position={dropoff}>
          <Popup>Drop-off Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};


export default RideMap