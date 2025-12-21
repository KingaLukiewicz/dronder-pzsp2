"use client";
import styles from "./page.module.css";
import Image from "next/image";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
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
        <NotificationsNoneOutlinedIcon sx={{ fontSize: "4vh" }} />
        <LogoutOutlinedIcon sx={{ fontSize: "4vh" }} />
      </div>
    </div>
  );
};
export default Header;
