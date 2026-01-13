"use client";

import Header from "../components/header/page";
import Sidebar from "../components/sidebar/page";
import styles from "./page.module.css";
import { useState } from "react";

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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const [events, setEvents] = useState<
    { id: string; title: string; start: Date; end: Date }[]
  >([
    {
      id: "1",
      title: "Ortofotomapa",
      start: new Date("2026-01-12"),
      end: new Date("2026-01-12"),
    },
    {
      id: "2",
      title: "Chmura punktów",
      start: new Date("2026-01-15"),
      end: new Date("2026-01-15"),
    },
  ]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Podaj nazwę wydarzenia:");
    if (title) {
      setEvents([
        ...events,
        { id: String(events.length + 1), title, start, end },
      ]);
    }
  };

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
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            style={{ height: 600 }}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
          />
        </div>
      </main>
    </div>
  );
}
