"use client";
import styles from "./page.module.css";
import Image from "next/image";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Badge } from "@mui/material";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    function onMatch(value: object) {
      // @ts-ignore
      setNotificationCount(value.count);
    }

    socket.on('match', onMatch);
    return () => {
      socket.off('match', onMatch);
    };

  }, []);

  return (
    <div className={styles.Header}>
      <div className={styles.HeaderLeft}>
        <div
          className={styles.appLogo}
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/dronder_logo_header.png"
            alt="App logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <p>DRONDER</p>
      </div>
      <div className={styles.HeaderRight}>
        <Badge badgeContent={notificationCount} color="primary">
          <NotificationsNoneOutlinedIcon sx={{ fontSize: "4vh" }} />
        </Badge>
        <LogoutOutlinedIcon sx={{ fontSize: "4vh" }} />
      </div>
    </div>
  );
};
export default Header;
