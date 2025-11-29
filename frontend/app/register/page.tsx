"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Register() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleRePasswordVisibility = () =>
    setRePasswordVisible(!rePasswordVisible);

  return (
    <div className={styles.RegisterContainer}>
      <div className={styles.RightBox} />
      <div className={styles.RegisterLeft}>
        <TextField
          className={styles.Input}
          label="imię"
          variant="outlined"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          className={styles.Input}
          label="nazwisko"
          variant="outlined"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
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
          <img
            src={
              passwordVisible
                ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                : "https://img.icons8.com/fluency-systems-regular/48/hide.png"
            }
            alt="toggle visibility"
            className={styles.PasswordToggle}
            onClick={togglePasswordVisibility}
          />
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
          <img
            src={
              rePasswordVisible
                ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                : "https://img.icons8.com/fluency-systems-regular/48/hide.png"
            }
            alt="toggle visibility"
            className={styles.PasswordToggle}
            onClick={toggleRePasswordVisibility}
          />
        </div>

        {error && <p className={styles.ErrorText}>{error}</p>}

        <Button
          className={styles.LeftButton}
          sx={{ textTransform: "none !important" }}
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
        >
          Zaloguj się!
        </Button>
      </div>
    </div>
  );
}
