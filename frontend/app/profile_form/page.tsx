"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { UserdataPost } from "../types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserdataGet } from "../types";

export default function ProfileForm() {
  const [userData, setUserData] = useState<UserdataGet | null>(null);
  const [userName, setUserName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [address, setAddress] = useState("");
  const [range, setRange] = useState("");
  const [offerTypes, setOfferTypes] = useState<string[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();

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
        if (!res.ok) {
          const text = await res.text();
          console.error("Backend returned non-JSON:", text);
          throw new Error(`Błąd backendu: ${res.status}`);
        }
        const data: UserdataGet = await res.json();
        setUserData(data);

        setUserName(data.username || "");
        setAboutMe(data.description || "");
        setAddress(data.location?.address || "");
        setRange(data.location?.radius?.toString() || "");
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch("http://127.0.0.1:5000/offer/types", {
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
    if (userData && offerTypes.length > 0) {
      const initialState: Record<string, boolean> = {};
      offerTypes.forEach((o) => {
        initialState[o] = userData.products?.includes(o) || false;
      });
      setSelectedOffers(initialState);
    }
  }, [userData, offerTypes]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOffers({
      ...selectedOffers,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      const products = Object.keys(selectedOffers).filter(
        (key) => selectedOffers[key]
      );

      const payload: UserdataPost = {
        username: userName || undefined,
        description: aboutMe || undefined,
        location:
          address || range
            ? {
                address: address || undefined,
                radius: range ? Number(range) : undefined,
              }
            : undefined,
        products: products.length > 0 ? products : [],
      };

      const res = await fetch("http://127.0.0.1:5001/user/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Błąd podczas zapisu: ${text}`);
      }
      router.push("/profile");
      alert("Profil został zaktualizowany!");
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
    <div className={styles.Form}>
      <h1>Uzupełnij swój profil</h1>
      <main className={styles.MainContent}>
        <h2>Nazwa użytkownika</h2>
        <input
          className={styles.InputLong}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <h2>O mnie</h2>
        <textarea
          className={styles.AboutMe}
          id="about-me"
          rows={5}
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
        <h2>Oferowane produkty</h2>
        <FormGroup>
          {offerTypes.map((offer) => (
            <FormControlLabel
              key={offer}
              control={
                <Checkbox
                  checked={selectedOffers[offer] || false}
                  onChange={handleChange}
                  name={offer}
                  sx={{
                    color: "#ffffff",
                    "&.Mui-checked": {
                      color: "#ffffff",
                    },
                  }}
                />
              }
              label={offer}
            />
          ))}
        </FormGroup>
        <h2>Lokalizacja</h2>
        <div className={styles.LocationRow}>
          <label htmlFor="address">Adres:</label>
          <input
            className={styles.Input}
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.LocationRow}>
          <label htmlFor="range">Zasięg (km):</label>
          <input
            className={styles.Input}
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          />
        </div>
        <div className={styles.ButtonRow}>
          <Button
            className={styles.Button}
            sx={{ textTransform: "none !important" }}
            onClick={handleSubmit}
          >
            Zapisz
          </Button>
        </div>
      </main>
    </div>
  );
}
