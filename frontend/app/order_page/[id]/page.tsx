"use client";

import Header from "@/app/components/header/page";
import Sidebar from "@/app/components/sidebar/page";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { OfferForm } from "@/app/types";
import { BASE_URL } from "@/app/constants";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [offerData, setOfferData] = useState<OfferForm | null>(null);
  const params = useParams();
  const offerId = params.id?.[0];

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("pl-PL");
  };

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/offer/${offerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Backend returned non-JSON:", text);
          throw new Error(`Błąd backendu: ${res.status}`);
        }
        const data: OfferForm[] = await res.json();
        setOfferData(data[0] ?? null);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    fetchOfferData();
  }, [offerId]);

  return (
    <div className={styles.OrderPage}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Szczegóły zlecenia</h1>
        {offerData ? (
          <div className={styles.MainContent}>
            <div className={styles.Section}>
              <h2>Typ usługi</h2>
              <p>{offerData.offer_type || "-"}</p>
            </div>

            <div className={styles.Section}>
              <h2>Opis zlecenia</h2>
              <p>{offerData.description || "-"}</p>
            </div>

            <div className={styles.Section}>
              <h2>Parametry</h2>
              <ul>
                {offerData.parameters?.map((param) => (
                  <li key={param.name}>
                    <strong>{param.name}:</strong> {param.value || "-"}
                  </li>
                )) || <li>-</li>}
              </ul>
            </div>

            <div className={styles.Section}>
              <h2>Lokalizacja</h2>
              {offerData.location ? (
                "address" in offerData.location ? (
                  <p>Adres: {offerData.location.address}</p>
                ) : (
                  <p>
                    Współrzędne: {offerData.location.geo_latitude},{" "}
                    {offerData.location.geo_longitude}, Promień:{" "}
                    {offerData.location.radius} m
                  </p>
                )
              ) : (
                <p>-</p>
              )}
            </div>

            <div className={styles.Section}>
              <h2>Termin wykonania</h2>
              <p>{formatDate(offerData.deadline_date)}</p>
            </div>
            {offerData.flight_date && (
              <div className={styles.Section}>
                <h2>Termin nalotu</h2>
                <p>{formatDate(offerData.flight_date)}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Ładowanie danych zlecenia...</p>
        )}
      </main>
    </div>
  );
}
