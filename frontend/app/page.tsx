"use client";

import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./map_picker"), { ssr: false });

export default function Home() {

  return (
    <MapPicker></MapPicker>
  );

  redirect("/login");
}
