"use client";

import Header from "@/app/components/header/page";
import Sidebar from "@/app/components/sidebar/page";
import styles from "./page.module.css";
import { useState } from "react";

export default function OrderPage() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={styles.OrderPage}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Szczegóły zlecenia</h1>
        <div className={styles.MainContent}>
          <div className={styles.Section}>
            <h2>Typ usługi</h2>
            <p>Ortofotomapy</p>
          </div>

          <div className={styles.Section}>
            <h2>Opis zlecenia</h2>
            <p>Ortofotomapa z dużą dokładnością</p>
          </div>

          <div className={styles.Section}>
            <h2>Parametry</h2>
            <ul>
              <li>
                <strong>GSD:</strong> 5cm
              </li>
              <li>
                <strong>Dokładność:</strong> 10cm
              </li>
              <li>
                <strong>RTK:</strong> Tak
              </li>
              <li>
                <strong>Photopoints:</strong> Nie
              </li>
            </ul>
          </div>

          <div className={styles.Section}>
            <h2>Lokalizacja</h2>
            <p>Adres: ul. Przykładowa 1, 00-001 Warszawa</p>
          </div>

          <div className={styles.Section}>
            <h2>Termin wykonania</h2>
            <p>12.01.2026</p>
          </div>

          <div className={styles.Section}>
            <h2>Termin nalotu</h2>
            <p>15.01.2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}
