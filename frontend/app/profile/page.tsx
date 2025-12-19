"use client";
import { useState } from "react";
import Header from "../header/page";
import Sidebar from "../sidebar/page";

export default function Profile() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="Profile">
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
    </div>
  );
}
