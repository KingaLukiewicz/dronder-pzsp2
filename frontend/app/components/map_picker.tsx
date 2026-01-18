"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

type Props = {
  value: { lat: number; lng: number } | null;
  onSelect: (pos: { lat: number; lng: number }) => void;
};

function LocationMarker({ onSelect }: { onSelect: Props["onSelect"] }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });

  return null;
}

export default function MapPicker({ value, onSelect }: Props) {
  return (
    <MapContainer
      center={value ? [value.lat, value.lng] : [52.2297, 21.0122]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker onSelect={onSelect} />
      {value && <Marker position={value} />}
    </MapContainer>
  );
}
