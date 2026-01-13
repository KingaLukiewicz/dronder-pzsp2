"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { ReviewPost } from "../../types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BASE_URL } from "@/app/constants";

export default function RateOrderForm() {
  const { id } = useParams();
  const offerId = Number(id);
  const [rating, setRating] = useState<number | null>(0);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

      const review: ReviewPost = {
        offer_id: offerId,
        rating: rating || undefined,
        review: description || undefined,
      };

      const res = await fetch(`${BASE_URL}/review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Błąd serwera: ${errText}`);
      }

      alert("Opinia została zapisana!");
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Wystąpił nieoczekiwany błąd.");
    }
  };

  return (
    <div className={styles.Form}>
      <h1>Oceń zlecenie</h1>
      <main className={styles.MainContent}>
        <h2>Twoja ocena</h2>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <h2>Opinia</h2>
        <textarea
          className={styles.Description}
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
