"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";


function LocationMarker({ setPosition }) {
  const [position, setLocalPosition] = useState(null);

  useMapEvents({
    click(e) {
      setLocalPosition(e.latlng);
      setPosition(e.latlng);
      console.log(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker() {
  const [position, setPosition] = useState(null);

  return (
    <MapContainer
      center={[52.2297, 21.0122]}
      zoom={13}
      style={{ height: "400px", width: "800px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setPosition={setPosition} />
    </MapContainer>
  );
}
