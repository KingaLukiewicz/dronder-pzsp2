"use client";

import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useState } from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import type { ComponentType } from "react";

const FullCalendar = dynamic(
  () =>
    import("@fullcalendar/react").then(
      (mod) => mod.default as unknown as ComponentType<any>
    ),
  { ssr: false }
);

export default function Calendar() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const [events, setEvents] = useState([
    { id: "1", title: "Ortofotomapa", start: "2026-01-12", end: "2026-01-12" },
    {
      id: "2",
      title: "Chmura punktów",
      start: "2026-01-15",
      end: "2026-01-15",
    },
  ]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(`Wybrane wydarzenie: ${clickInfo.event.title}`);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Podaj nazwę wydarzenia:");
    if (title) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        },
      ]);
    }
  };

  return (
    <div className={styles.CalendarPage}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        <h1>Mój kalendarz</h1>
        <div className={styles.CalendarContainer}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable
            selectable
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
          />
        </div>
      </main>
    </div>
  );
}
