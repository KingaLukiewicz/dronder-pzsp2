"use client";
import { useState, useEffect } from "react";
import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import MatchedInfo from "../components/matched_info/page";
import { OfferForm } from "../types";

export default function Matched() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [offers, setOffers] = useState<OfferForm[]>([]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch("http://127.0.0.1:5001/matches/offer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: OfferForm[] = await res.json();

        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className={styles.Matched}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Dopasowania</h1>
        {offers.length == 0 ? (
          <p>Nie masz aktualnie zadnych dopasowań.</p>
        ) : (
          <>
            {offers.map((offer) => {
              <MatchedInfo
                key={offer.offer_id}
                user_id={offer.client_id}
                title={`${offer.client_name} : ${offer.offer_type}`}
                description={offer.description}
              />;
            })}
          </>
        )}
      </main>
    </div>
  );
}
