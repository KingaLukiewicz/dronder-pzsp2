"use client";

import { useState } from "react";
import Header from "../components/header/page";
import styles from "./page.module.css";
import { Card } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { People, Business } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Admin() {
  type TimeRange = "week" | "month" | "year";
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const chartData: Record<TimeRange, { name: string; zlecenia: number }[]> = {
    week: [
      { name: "Pon", zlecenia: 12 },
      { name: "Wt", zlecenia: 19 },
      { name: "Śr", zlecenia: 15 },
      { name: "Czw", zlecenia: 22 },
      { name: "Pt", zlecenia: 18 },
      { name: "Sob", zlecenia: 8 },
      { name: "Ndz", zlecenia: 5 },
    ],
    month: [
      { name: "Tydz. 1", zlecenia: 65 },
      { name: "Tydz. 2", zlecenia: 78 },
      { name: "Tydz. 3", zlecenia: 55 },
      { name: "Tydz. 4", zlecenia: 92 },
    ],
    year: [
      { name: "Sty", zlecenia: 245 },
      { name: "Lut", zlecenia: 289 },
      { name: "Mar", zlecenia: 312 },
      { name: "Kwi", zlecenia: 278 },
      { name: "Maj", zlecenia: 334 },
      { name: "Cze", zlecenia: 298 },
      { name: "Lip", zlecenia: 356 },
      { name: "Sie", zlecenia: 321 },
      { name: "Wrz", zlecenia: 298 },
      { name: "Paź", zlecenia: 287 },
      { name: "Lis", zlecenia: 312 },
      { name: "Gru", zlecenia: 345 },
    ],
  };

  return (
    <div className={styles.AdminPage}>
      <Header />

      <main className={styles.AdminContainer}>
        <div className={styles.StatGrid}>
          <Card className={styles.StatCard}>
            <div className={styles.StatContent}>
              <div>
                <p>Liczba operatorów</p>
                <h2>127</h2>
              </div>
              <div className={styles.StatIcon}>
                <People sx={{ color: "white", fontSize: 32 }} />
              </div>
            </div>
          </Card>

          <Card className={styles.StatCard}>
            <div className={styles.StatContent}>
              <div>
                <p>Liczba zleceniodawców</p>
                <h2>89</h2>
              </div>
              <div className={styles.StatIcon}>
                <Business sx={{ color: "white", fontSize: 32 }} />
              </div>
            </div>
          </Card>
        </div>

        <Card className={styles.ChartCard}>
          <div className={styles.ChartHeader}>
            <h2>Wykres zleceń</h2>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Zakres</InputLabel>
              <Select
                value={timeRange}
                label="Zakres"
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              >
                <MenuItem value="week">Tydzień</MenuItem>
                <MenuItem value="month">Miesiąc</MenuItem>
                <MenuItem value="year">Rok</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData[timeRange]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="zlecenia" fill="#184E77" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </main>
    </div>
  );
}
