"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Image from "next/image";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleRePasswordVisibility = () =>
    setRePasswordVisible(!rePasswordVisible);

  const handleRegister = async () => {
    setError(null);

    if (!username || !email || !phone_number || !password || !re_password) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/register", {
        // podmienić 127.0.0.1:5000 na backend:5000 dla dockera
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          phone_number,
          password,
          re_password,
        }),
      });

      if (!res.ok) {
        const errors = await res.json();

        if (errors && Array.isArray(errors) && errors.length > 0) {
          throw new Error(errors[0].msg);
        }

        throw new Error(errors.msg || "Rejestracja nie powiodła się.");
      }

      alert("Rejestracja udana! Zaloguj się.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Coś poszło nie tak.");
      }
    }
  };

  const handleGoLogin = async () => {
    redirect("/login");
  };

  return (
    <div className={styles.RegisterContainer}>
      <div className={styles.RightBox} />
      <div className={styles.RegisterLeft}>
        <div className={styles.appLogo}>
          <Image
            src="/dronder_logo.png"
            alt="App logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <TextField
          className={styles.Input}
          label="nazwa użytkownika"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          className={styles.Input}
          label="numer telefonu"
          variant="outlined"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          className={styles.Input}
          label="e-mail"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.PasswordContainer}>
          <TextField
            className={styles.Input}
            label="hasło"
            variant="outlined"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.PasswordToggle}>
            <Image
              src={
                passwordVisible
                  ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                  : "https://img.icons8.com/fluency-systems-regular/48/hide.png"
              }
              alt="toggle visibility"
              fill
              style={{ objectFit: "contain" }}
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

        <div className={styles.PasswordContainer}>
          <TextField
            className={styles.Input}
            label="ponów hasło"
            variant="outlined"
            type={rePasswordVisible ? "text" : "password"}
            value={re_password}
            onChange={(e) => setRePassword(e.target.value)}
          />
          <div className={styles.PasswordToggle}>
            <Image
              src={
                rePasswordVisible
                  ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                  : "https://img.icons8.com/fluency-systems-regular/48/hide.png"
              }
              alt="toggle visibility"
              fill
              style={{ objectFit: "contain" }}
              onClick={toggleRePasswordVisibility}
            />
          </div>
        </div>

        {error && <p className={styles.ErrorText}>{error}</p>}

        <Button
          className={styles.LeftButton}
          sx={{ textTransform: "none !important" }}
          onClick={handleRegister}
        >
          Zarejestruj
        </Button>
      </div>

      <div className={styles.RegisterRight}>
        <h1>Witaj z powrotem!</h1>
        <p>Masz już konto?</p>
        <Button
          className={styles.RightButton}
          variant="outlined"
          sx={{ textTransform: "none !important" }}
          onClick={handleGoLogin}
        >
          Zaloguj się!
        </Button>
      </div>
    </div>
  );
}
