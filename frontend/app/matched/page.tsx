"use client";
import { useState, useEffect } from "react";
import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import MatchedInfo from "../components/matched_info/page";
import { OfferForm, UserdataGet } from "../types";
import { BASE_URL } from "../constants";
import { useRouter } from "next/navigation";

export default function Matched() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [offers, setOffers] = useState<OfferForm[]>([]);
  const [operators, setOperators] = useState<UserdataGet[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleOfferDetails = (id: number) => {
    router.push(`/order_page/${id}`);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/matches/offer`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: OfferForm[] = await res.json();

        setOffers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/matches/operator`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Record<number, UserdataGet[]> = await res.json();
        const operatorsWithOffer = Object.entries(data).flatMap(
          ([offer_id, users]) => {
            const usersArray = Array.isArray(users) ? users : [users];
            return usersArray.map((user) => ({
              ...user,
              offer_id: Number(offer_id),
            }));
          }
        );
        setOperators(operatorsWithOffer);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchOperators();
  }, []);

  const handleAcceptOffer = async (offer_id: number) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      const res = await fetch(`${BASE_URL}/matches/accept/offer/${offer_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Błąd podczas zapisu: ${text}`);
      }
      alert("Zaakceptowałeś zlecenie.");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        alert(err.message);
      } else {
        alert("Coś poszło nie tak.");
      }
    }
  };

  const handleAcceptOperator = async (
    offer_id: number,
    operator_id: number
  ) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      const res = await fetch(
        `${BASE_URL}/matches/accept/operator/${offer_id}/${operator_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Błąd podczas zapisu: ${text}`);
      }
      alert("Zaakceptowałeś operatora.");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        alert(err.message);
      } else {
        alert("Coś poszło nie tak.");
      }
    }
  };

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
            {role === "operator" &&
              offers.map((offer) => (
                <MatchedInfo
                  key={offer.offer_id}
                  user_id={offer.client_id}
                  title={`${offer.client_name} : ${offer.offer_type}`}
                  description={offer.description}
                  onClick={() => handleOfferDetails(offer.offer_id)}
                  handleAccept={() => handleAcceptOffer(offer.offer_id)}
                />
              ))}
            {operators.map((operator) => (
              <MatchedInfo
                key={operator.user_id}
                user_id={operator.user_id}
                title={operator.username}
                description={operator.description}
                reviews={operator.reviews}
                onClick={() =>
                  operator.offer_id && handleOfferDetails(operator.offer_id)
                }
                handleAccept={() =>
                  operator.offer_id &&
                  handleAcceptOperator(operator.offer_id, operator.user_id)
                }
              >
                <MatchedInfo.Rating />
              </MatchedInfo>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
