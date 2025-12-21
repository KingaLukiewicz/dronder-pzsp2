"use client";
import { useState, useEffect } from "react";
import Header from "../header/page";
import Sidebar from "../sidebar/page";
import styles from "./page.module.css";
import ReviewBox from "../review_box/page";
import { Tooltip, Rating } from "@mui/material";
import { UserdataGet } from "../types";

export default function Profile() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [userData, setUserData] = useState<UserdataGet | null>(null);
  const totalReviews = userData?.reviews?.length ?? 0;
  const averageRating =
    totalReviews > 0
      ? userData!.reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }

        const res = await fetch("http://127.0.0.1:5000/user/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data: UserdataGet = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className={styles.Profile}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Mój profil</h1>
        {userData && (
          <>
            <div className={styles.InfoContainer}>
              <div className={styles.Info}>
                <h2>{userData.username}</h2>
                <p>{userData.description}</p>
                <div className={styles.Rating}>
                  <div className={styles.StarRating}>
                    <Tooltip placement="top" title={averageRating}>
                      <span>
                        <Rating
                          name="read-only"
                          value={averageRating}
                          precision={0.1}
                          readOnly
                        />
                      </span>
                    </Tooltip>
                  </div>
                  <p>{`${totalReviews} oceny`}</p>
                </div>
              </div>
            </div>
          </>
        )}

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
