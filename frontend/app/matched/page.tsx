"use client";
import { useState } from "react";
import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import MatchedInfo from "../components/matched_info/page";

export default function Matched() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={styles.Matched}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Dopasowania</h1>
        <MatchedInfo
          title="Ortofotomapa dla miasta Kraków"
          description="Kompleksowa ortofotomapa obejmująca centrum miasta oraz dzielnice peryferyjne."
          rating={4.7}
          vote_count={12}
        />
      </main>
    </div>
  );
}
