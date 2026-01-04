"use client";
import styles from "./page.module.css";
import Image from "next/image";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useRouter } from "next/navigation";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();

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
        <NotificationsNoneOutlinedIcon sx={{ fontSize: "4vh" }} />
        <div onClick={handleLogOut} style={{ cursor: "pointer" }}>
          <LogoutOutlinedIcon sx={{ fontSize: "4vh" }} />
        </div>
      </div>
    </div>
  );
};
export default Header;
