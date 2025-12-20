"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

export default function ProfileForm() {
  const [aboutMe, setAboutMe] = useState("");
  const [address, setAddress] = useState("");
  const [range, setRange] = useState("");
  const [state, setState] = useState({
    map: false,
    nmp: false,
    nmpt: false,
    cloud: false,
    mesh: false,
    scanning: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { map, nmp, nmpt, cloud, mesh, scanning } = state;
  return (
    <div className={styles.Form}>
      <h1>Uzupełnij swój profil</h1>
      <main className={styles.MainContent}>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={map}
                onChange={handleChange}
                name="map"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Ortofotomapy"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={nmp}
                onChange={handleChange}
                name="nmp"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Numeryczne Modele Terenu"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={nmpt}
                onChange={handleChange}
                name="nmpt"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Numeryczne Modele Pokrycia Terenu"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cloud}
                onChange={handleChange}
                name="cloud"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Chmury Punktów"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mesh}
                onChange={handleChange}
                name="mesh"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Modele Mesh 3D"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={scanning}
                onChange={handleChange}
                name="scanning"
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: "#ffffff",
                  },
                }}
              />
            }
            label="Scanning Laserowy"
          />
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
          >
            Zapisz
          </Button>
        </div>
      </main>
    </div>
  );
}
