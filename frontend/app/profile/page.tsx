"use client";
import { useState } from "react";
import Header from "../header/page";
import Sidebar from "../sidebar/page";
import styles from "./page.module.css";
import ReviewBox from "../review_box/page";
import { Tooltip, Rating } from "@mui/material";

export default function Profile() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState("");

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={styles.Profile}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Mój profil</h1>
        <div className={styles.InfoContainer}>
          <div className={styles.Info}>
            <h2>Jan Kowalski</h2>
            <p>
              Donec lobortis maximus erat non dapibus. Vivamus lobortis cursus
              sodales. Phasellus fringilla arcu sit amet nunc placerat
              fringilla. Aliquam interdum in odio nec sollicitudin. Quisque
              rhoncus vel lacus ut suscipit. Donec auctor euismod lorem eu
              luctus.
            </p>
            <div className={styles.Rating}>
              <div className={styles.StarRating}>
                <Tooltip placement="top" title={`4.56`}>
                  <span>
                    <Rating
                      name="read-only"
                      value={4.56}
                      precision={0.1}
                      readOnly
                    />
                  </span>
                </Tooltip>
              </div>
              <p>{`84 oceny`}</p>
            </div>
          </div>
        </div>
        <h2>OPINIE</h2>
        <select
          className={styles.Select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">-- Sortuj według --</option>
          <option value="new">Od najnowszych</option>
          <option value="best">Od najlepszych</option>
          <option value="worst">Od najgorszych</option>
        </select>
        <div className={styles.Reviews}>
          <ReviewBox />
        </div>
      </main>
    </div>
  );
}
