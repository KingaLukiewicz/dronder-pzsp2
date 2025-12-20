"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import { useState } from "react";

export default function ProfileForm() {
  const [rating, setRating] = useState<number | null>(0);
  const [description, setDescription] = useState("");
  const [state, setState] = useState({
    completed: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { completed } = state;
  return (
    <div className={styles.Form}>
      <h1>Oceń zlecenie</h1>
      <main className={styles.MainContent}>
        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={handleChange}
              name="completed"
              sx={{
                color: "#ffffff",
                "&.Mui-checked": {
                  color: "#ffffff",
                },
              }}
            />
          }
          label="Czy zlecenie odbyło się?"
        />
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
        >
          Zapisz
        </Button>
      </div>
    </div>
  );
}
