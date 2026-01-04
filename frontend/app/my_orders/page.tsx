"use client";

import Header from "../header/page";
import Sidebar from "../sidebar/page";
import styles from "./page.module.css";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OrderPill from "../order_pill/page";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export default function MyOrders() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleReroute = async () => {
    router.push("/create_order");
  };

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
              <div className={styles.OrderList}>
                <OrderPill title="Ortofotomapa" deadline="12.01.2026" />
                <OrderPill title="Chmura punktów" deadline="15.01.2026" />
                <OrderPill title="Modele 3D" deadline="20.01.2026" />
                <OrderPill title="NMP" deadline="25.01.2026" />
              </div>
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
              <div className={styles.OrderList}>
                <OrderPill title="Ortofotomapa" deadline="12.11.2025" />
                <OrderPill title="Chmura punktów" deadline="15.11.2025" />
                <OrderPill title="Modele 3D" deadline="20.11.2025" />
                <OrderPill title="NMP" deadline="25.11.2025" />
              </div>
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
