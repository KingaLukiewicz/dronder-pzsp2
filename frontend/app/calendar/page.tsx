"use client";

import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { BASE_URL } from "../constants";
import { OfferForm } from "../types";

import {
  Calendar as BigCalendar,
  Views,
  dateFnsLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";

type EventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const locales = {
  "pl-PL": pl,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [events, setEvents] = useState<EventType[]>([]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const fetchOngoingOffers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const res = await fetch(`${BASE_URL}/offer/ongoing`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: OfferForm[] = await res.json();
        if (!Array.isArray(data)) return;

        const ongoingEvents: EventType[] = data.flatMap((offer) => {
          const events: EventType[] = [];
          if (offer.deadline_date) {
            events.push({
              id: `${offer.offer_id}-deadline`,
              title: `${offer.offer_type} - deadline`,
              start: new Date(offer.deadline_date),
              end: new Date(offer.deadline_date),
            });
          }
          if (offer.flight_date) {
            events.push({
              id: `${offer.offer_id}-flight`,
              title: `${offer.offer_type} - flight`,
              start: new Date(offer.flight_date),
              end: new Date(offer.flight_date),
            });
          }
          return events;
        });

        setEvents((prev) => [...prev, ...ongoingEvents]);
      } catch (error) {
        console.error("Failed to fetch ongoing offers:", error);
      }
    };

    fetchOngoingOffers();
  }, []);

  const handleSelectEvent = (event: EventType) => {
    alert(`Wybrane wydarzenie: ${event.title}`);
  };

  return (
    <div className={styles.CalendarPage}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Mój kalendarz</h1>
        <div className={styles.CalendarContainer}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            selectable
            onSelectEvent={handleSelectEvent}
            style={{ height: 600 }}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
          />
        </div>
      </main>
    </div>
  );
}
