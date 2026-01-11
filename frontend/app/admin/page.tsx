"use client";

import { useState, useEffect } from "react";
import Header from "../components/header/page";
import styles from "./page.module.css";
import { Card, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BASE_URL } from "../constants";

type TimeRange = "day" | "month" | "year";

type AdminData = {
  number_of_admins: number;
  number_of_clients: number;
  number_of_operators: number;
  operator_rating_stats: Record<number, number>;
  client_rating_stats: Record<number, number>;
  number_of_offers: number;
  number_of_offers_by_deadline: Record<string, number>;
};

export default function Admin() {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

        const res = await fetch(`${BASE_URL}/admin/data`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Błąd pobierania danych: ${res.status}`);
        const json: AdminData = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Ładowanie danych...</p>;
  if (!data) return <p>Brak danych do wyświetlenia</p>;

  const offers = data.number_of_offers_by_deadline;

  const generateChartData = (): { name: string; zlecenia: number }[] => {
    const today = new Date();

    if (timeRange === "day") {
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const daysInMonth = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
        0
      ).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          i + 1
        );
        const dateStr = date.toISOString().split("T")[0];
        return { name: String(i + 1), zlecenia: offers[dateStr] || 0 };
      });
    }

    if (timeRange === "month") {
      const year = today.getFullYear() - 1;
      return Array.from({ length: 12 }, (_, i) => {
        const monthNames = [
          "Sty",
          "Lut",
          "Mar",
          "Kwi",
          "Maj",
          "Cze",
          "Lip",
          "Sie",
          "Wrz",
          "Paź",
          "Lis",
          "Gru",
        ];
        const daysInMonth = new Date(year, i + 1, 0).getDate();
        let sum = 0;
        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = new Date(year, i, d).toISOString().split("T")[0];
          sum += offers[dateStr] || 0;
        }
        return { name: monthNames[i], zlecenia: sum };
      });
    }

    if (timeRange === "year") {
      const currentYear = today.getFullYear();
      return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - i - 1;
        let sum = 0;
        for (const dateStr in offers) {
          if (dateStr.startsWith(String(year))) sum += offers[dateStr] || 0;
        }
        return { name: String(year), zlecenia: sum };
      }).reverse();
    }

    return [];
  };

  const chartData = generateChartData();

  return (
    <div className={styles.AdminPage}>
      <Header />

      <main className={styles.AdminContainer}>
        <div className={styles.StatGrid}>
          <Card className={styles.StatCard}>
            <p>Liczba operatorów</p>
            <h2>{data.number_of_operators}</h2>
          </Card>
          <Card className={styles.StatCard}>
            <p>Liczba zleceniodawców</p>
            <h2>{data.number_of_clients}</h2>
          </Card>
          <Card className={styles.StatCard}>
            <p>Liczba adminów</p>
            <h2>{data.number_of_admins}</h2>
          </Card>
          <Card className={styles.StatCard}>
            <p>Liczba wszystkich zleceń</p>
            <h2>{data.number_of_offers}</h2>
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
                <MenuItem value="day">Dzień (poprzedni miesiąc)</MenuItem>
                <MenuItem value="month">Miesiąc (poprzedni rok)</MenuItem>
                <MenuItem value="year">Rok (ostatnie lata)</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
