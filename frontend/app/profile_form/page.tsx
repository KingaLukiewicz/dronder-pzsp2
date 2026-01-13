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
import { BASE_URL } from "../constants";

export default function ProfileForm() {
  const [userData, setUserData] = useState<UserdataGet | null>(null);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [address, setAddress] = useState("");
  const [range, setRange] = useState("");
  const [offerTypes, setOfferTypes] = useState<string[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<Record<string, boolean>>(
    {}
  );
  const [weekdays, setWeekdays] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/user/data`, {
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

        setRole(data.role || "");
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

  useEffect(() => {
    const fetchWeekdays = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

        const res = await fetch(`${BASE_URL}/user/weekdays`, {
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

        const data: Record<string, boolean> = await res.json();

        const orderedDays = [
          "Poniedziałek",
          "Wtorek",
          "Środa",
          "Czwartek",
          "Piątek",
          "Sobota",
          "Niedziela",
        ];
        const initialWeekdays: Record<string, boolean> = {};
        orderedDays.forEach((day) => {
          initialWeekdays[day] = !!data[day];
        });

        setWeekdays(initialWeekdays);
      } catch (err) {
        console.error("Failed to fetch weekdays:", err);
      }
    };

    if (role === "operator") fetchWeekdays();
  }, [role]);

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

      const res = await fetch(`${BASE_URL}/user/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Błąd podczas zapisu danych użytkownika: ${text}`);
      }

      if (role === "operator") {
        const weekdaysPayload = { weekdays };

        const resWeekdays = await fetch(`${BASE_URL}/user/weekdays`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(weekdaysPayload),
        });

        if (!resWeekdays.ok) {
          const text = await resWeekdays.text();
          throw new Error(`Błąd podczas zapisu dostępności: ${text}`);
        }
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
        {role == "operator" && (
          <>
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
            <h2>Dostępność czasowa</h2>
            <FormGroup>
              {[
                "Poniedziałek",
                "Wtorek",
                "Środa",
                "Czwartek",
                "Piątek",
                "Sobota",
                "Niedziela",
              ].map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={weekdays[day] || false}
                      onChange={(e) =>
                        setWeekdays((prev) => ({
                          ...prev,
                          [day]: e.target.checked,
                        }))
                      }
                      name={day}
                      sx={{
                        color: "#ffffff",
                        "&.Mui-checked": { color: "#ffffff" },
                      }}
                    />
                  }
                  label={day}
                />
              ))}
            </FormGroup>
          </>
        )}

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
