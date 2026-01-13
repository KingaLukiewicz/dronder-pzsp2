"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import { OfferPost } from "../types";
import { BASE_URL } from "../constants";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateOrderForm() {
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [locationMode, setLocationMode] = useState<"address" | "coords">(
    "address"
  );
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [deadline, setDeadline] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [offerTypes, setOfferTypes] = useState<string[]>([]);
  const [parameters, setParameters] = useState<
    { name: string; value: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/offer/types`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: string[] = await res.json();

        setOfferTypes(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchParameters = async () => {
      if (!service) return;
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/offer/parameters/${service}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: string[] = await res.json();
        const params = data.map((p) => ({ name: p, value: "" }));
        setParameters(params);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchParameters();
  }, [service]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toUTCString();
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

      let locationPayload;

      if (locationMode === "address") {
        if (!address) {
          alert("Podaj adres lokalizacji");
          return;
        }

        locationPayload = {
          address: address,
        };
      } else {
        if (!latitude || !longitude || !radius) {
          alert("Podaj współrzędne geograficzne i promień");
          return;
        }

        locationPayload = {
          geo_latitude: latitude,
          geo_longitude: longitude,
          radius: Number(radius),
        };
      }

      const offer: OfferPost = {
        description,
        offer_type: service,
        deadline_date: formatDate(deadline),
        location: locationPayload,
        parameters: parameters,
      };

      if (flightDate) {
        offer.flight_date = formatDate(flightDate);
      }

      const res = await fetch(`${BASE_URL}/offer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(offer),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Błąd serwera: ${errText}`);
      }

      alert("Zlecenie zostało utworzone!");
      router.push("/my_orders");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <div className={styles.Form}>
      <h1>Utwórz zlecenie</h1>
      <main className={styles.MainContent}>
        <h2>Opis zelecenia</h2>
        <textarea
          className={styles.Description}
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className={styles.Select}
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">-- Wybierz usługę --</option>
          {offerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <h2>Parametry</h2>
        {parameters.map((param, idx) => (
          <div key={idx} className={styles.ParamRow}>
            <label htmlFor={param.name}>{param.name}:</label>
            <input
              className={styles.Input}
              id={param.name}
              value={param.value}
              onChange={(e) => {
                const newParams = [...parameters];
                newParams[idx].value = e.target.value;
                setParameters(newParams);
              }}
            />
          </div>
        ))}
        <h2>Lokalizacja</h2>
        <label>
          <input
            type="radio"
            checked={locationMode === "address"}
            onChange={() => setLocationMode("address")}
          />
          Adres
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            checked={locationMode === "coords"}
            onChange={() => setLocationMode("coords")}
          />
          Współrzędne
        </label>
        {locationMode === "address" && (
          <div className={styles.ParamRow}>
            <label htmlFor="address">Adres:</label>
            <input
              className={styles.Input}
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}
        {locationMode === "coords" && (
          <>
            <div className={styles.ParamRow}>
              <label htmlFor="latitude">
                Szerokość geograficzna (latitude):
              </label>
              <input
                className={styles.Input}
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className={styles.ParamRow}>
              <label htmlFor="longitude">
                Długość geograficzna (longitude):
              </label>
              <input
                className={styles.Input}
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
            <div className={styles.ParamRow}>
              <label htmlFor="radius">Promień [m]:</label>
              <input
                className={styles.Input}
                id="radius"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>
          </>
        )}
        <h2>Termin wykonania zlecenia</h2>
        <input
          type="date"
          className={styles.InputLong}
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <h2>Termin nalotu (opcjonalnie)</h2>
        <input
          type="date"
          className={styles.InputLong}
          id="flightDate"
          value={flightDate}
          onChange={(e) => setFlightDate(e.target.value)}
        />
      </main>
      <div className={styles.ButtonRow}>
        <Button
          className={styles.Button}
          sx={{ textTransform: "none !important" }}
          onClick={handleSubmit}
        >
          Zapisz
        </Button>
      </div>
    </div>
  );
}
