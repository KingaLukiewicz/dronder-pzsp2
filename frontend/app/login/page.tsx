"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Log() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null); // Clear previous errors

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        // replace with "http://backend:5000/auth/login" when running on docker
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Błędny email lub hasło");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Coś poszło nie tak.");
      }
    }
  };

  const handleGoRegister = async () => {
    redirect("/register");
  };

  return (
    <div className={styles.LogContainer}>
      <div className={styles.LeftBox} />
      <div className={styles.LogLeft}>
        <h1>Witaj w Dronder</h1>
        <p>Pierwszy raz w naszym serwisie?</p>
        <Button
          className={styles.LeftButton}
          variant="outlined"
          sx={{ textTransform: "none !important" }}
          onClick={handleGoRegister}
        >
          Zarejestruj się!
        </Button>
      </div>
      <div className={styles.LogRight}>
        <div className={styles.appLogo}>
          <Image
            src="/dronder_logo.png"
            alt="App logo"
            fill
            style={{ objectFit: "contain" }} // or "cover"
          />
        </div>
        <TextField
          className={styles.Input}
          id="outlined-basic"
          label="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className={styles.Input}
          id="outlined-basic"
          label="hasło"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}
        <Button
          className={styles.RightButton}
          sx={{ textTransform: "none !important" }}
          onClick={handleLogin}
        >
          Zaloguj
        </Button>
      </div>
    </div>
  );
}
