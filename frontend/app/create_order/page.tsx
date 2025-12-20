"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

export default function ProfileForm() {
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [gsd, setGSD] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [file, setFile] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [state, setState] = useState({
    rtk: false,
    photopoints: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { rtk, photopoints } = state;
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
          <option value="map">Ortofotomapy</option>
          <option value="nmp">Numeryczne Modele Terenu</option>
          <option value="nmpt">Numeryczne Modele Pokrycia Terenu</option>
          <option value="cloud">Chmury Punktów</option>
          <option value="mesh">Modele Mesh 3D</option>
          <option value="scanning">Scanning Laserowy</option>
        </select>
        <h2>Parametry</h2>
        <div className={styles.ParamRow}>
          <label htmlFor="gsd">GSD:</label>
          <input
            className={styles.Input}
            id="gsd"
            value={gsd}
            onChange={(e) => setGSD(e.target.value)}
          />
        </div>
        <div className={styles.ParamRow}>
          <label htmlFor="accuracy">Dokładność:</label>
          <input
            className={styles.Input}
            id="accuracy"
            value={accuracy}
            onChange={(e) => setAccuracy(e.target.value)}
          />
        </div>
        <div className={styles.ParamRow}>
          <label htmlFor="file">Format pliku:</label>
          <input
            className={styles.Input}
            id="file"
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={rtk}
                onChange={handleChange}
                name="rtk"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Czy dron ma posiadać odbiornik RTK?"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={photopoints}
                onChange={handleChange}
                name="photopoints"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Czy mają być wykonane pomiary fotopunktów?"
          />
        </FormGroup>
        <h2>Lokalizacja</h2>
        <input
          className={styles.InputLong}
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
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
        >
          Zapisz
        </Button>
      </div>
    </div>
  );
}
