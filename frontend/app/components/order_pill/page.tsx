"use client";
import styles from "./page.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, createContext, useContext } from "react";
import { BASE_URL } from "@/app/constants";
import { Button } from "@mui/material";

type OrderPillContext = {
  id: number;
  title: string;
  deadline: string;
};

const OrderPillContext = createContext<OrderPillContext | undefined>(undefined);

function useOrderPillContext() {
  const context = useContext(OrderPillContext);
  if (!context) {
    throw new Error("use OrderPillContext must be within OrderPill");
  }
  return context;
}

type Props = PropsWithChildren & {
  id: number;
  title: string;
  deadline: string;
};

type OrderPillComponent = React.FC<Props> & {
  Status: React.FC;
  Rate: React.FC;
};

const OrderPill: OrderPillComponent = ({ children, id, title, deadline }) => {
  const router = useRouter();

  const handleReroute = () => {
    router.push(`/order_page/${id}`);
  };

  return (
    <OrderPillContext.Provider value={{ id, title, deadline }}>
      <div className={styles.OrderPill}>
        <div className={styles.Left}>
          {children}
          <p>{title}</p>
          <p>deadline: {deadline}</p>
        </div>
        <div className={styles.Right} onClick={handleReroute}>
          <p>Zobacz szczegóły</p>
          <ArrowForwardIosIcon className={styles.Arrow} />
        </div>
      </div>
    </OrderPillContext.Provider>
  );
};

OrderPill.Rate = function OrderPillRate() {
  const { id } = useOrderPillContext();
  const router = useRouter();

  const handleReroute = async () => {
    router.push(`/rate_order/${id}`);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Button
        variant="outlined"
        onClick={handleReroute}
        className={styles.OrderPillButton}
      >
        Oceń zlecenie
      </Button>
    </div>
  );
};

OrderPill.Status = function OrderPillStatus() {
  const { id } = useOrderPillContext();
  const [loading, setLoading] = React.useState(false);

  const handleFinalize = async () => {
    if (!confirm("Czy na pewno chcesz zakończyć to zlecenie?")) return;

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

      const res = await fetch(`${BASE_URL}/offer/finalized/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Błąd podczas zakończenia zlecenia: ${text}`);
      }

      alert("Zlecenie zostało zakończone!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        alert(err.message);
      } else {
        alert("Coś poszło nie tak.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Button
        variant="outlined"
        onClick={handleFinalize}
        className={styles.OrderPillButton}
        disabled={loading}
      >
        {loading ? "Trwa finalizacja..." : "Zakończ zlecenie"}
      </Button>
    </div>
  );
};
export default OrderPill;
