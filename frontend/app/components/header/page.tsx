"use client";
import styles from "./page.module.css";
import Image from "next/image";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { Badge } from "@mui/material";
import { useRouter } from "next/navigation";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const router = useRouter();

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    function onMatch(value: object) {
      // @ts-expect-error
      setNotificationCount(value.count);
    }

    socket.on('match', onMatch);
    return () => {
      socket.off('match', onMatch);
    };

  }, []);


  const handleLogOut = async () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

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
        <div onClick={handleLogOut} style={{ cursor: "pointer" }}>
          <LogoutOutlinedIcon sx={{ fontSize: "4vh" }} />
        </div>
      </div>
    </div>
  );
};
export default Header;
