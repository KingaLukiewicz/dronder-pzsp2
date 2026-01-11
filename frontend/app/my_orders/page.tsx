"use client";

import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OrderPill from "../components/order_pill/page";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../constants";
import { OfferForm } from "../types";

export default function MyOrders() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [ongoing, setOngoing] = useState<OfferForm[]>([]);
  const [finalized, setFinalized] = useState<OfferForm[]>([]);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleReroute = async () => {
    router.push("/create_order");
  };

  useEffect(() => {
    const fetchOngoingOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/offer/ongoing`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: OfferForm[] = await res.json();

        setOngoing(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchOngoingOffers();
  }, []);

  useEffect(() => {
    const fetchFinalizedOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/offer/finalized`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: OfferForm[] = await res.json();

        setFinalized(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchFinalizedOffers();
  }, []);

  return (
    <div className={styles.MyOrders}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Moje zlecenia</h1>
        <div className={styles.Orders}>
          <Accordion sx={{ width: "95%" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "1.5rem",
                  fontWeight: 700,
                },
              }}
            >
              <Typography component="span">Aktualne</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {ongoing.length > 0 ? (
                <div className={styles.OrderList}>
                  {ongoing.map((offer, index) => (
                    <OrderPill
                      key={offer.offer_id ?? index}
                      title={offer.offer_type}
                      deadline={
                        offer.deadline_date
                          ? new Date(offer.deadline_date).toLocaleDateString()
                          : "Brak terminu"
                      }
                    />
                  ))}
                </div>
              ) : (
                <p>Brak aktualnych zleceń</p>
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: "95%" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "1.5rem",
                  fontWeight: 700,
                },
              }}
            >
              <Typography component="span">Historia</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {finalized.length > 0 ? (
                <div className={styles.OrderList}>
                  {finalized.map((offer, index) => (
                    <OrderPill
                      key={offer.offer_id ?? index}
                      title={offer.offer_type}
                      deadline={
                        offer.deadline_date
                          ? new Date(offer.deadline_date).toLocaleDateString()
                          : "Brak terminu"
                      }
                    />
                  ))}
                </div>
              ) : (
                <p>Brak zakończonych zleceń</p>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className={styles.AddOrder} onClick={handleReroute}>
          <AddIcon sx={{ marginRight: "0.5rem" }} />
          <span>Dodaj zlecenie</span>
        </div>
      </main>
    </div>
  );
}
