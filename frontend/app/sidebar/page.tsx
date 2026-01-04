"use client";
import styles from "./page.module.css";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleReroute = async (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className={styles.Sidebar}>
      <div className={styles.Nav}>
        <p
          className={isActive("/profile") ? styles.Active : ""}
          onClick={() => handleReroute("/profile")}
          style={{ cursor: "pointer" }}
        >
          Mój profil
        </p>
        <p
          className={isActive("/matched") ? styles.Active : ""}
          onClick={() => handleReroute("/matched")}
          style={{ cursor: "pointer" }}
        >
          Dopasowane zlecenia
        </p>
        <p
          className={isActive("/my-orders") ? styles.Active : ""}
          onClick={() => handleReroute("/my-orders")}
          style={{ cursor: "pointer" }}
        >
          Moje zlecenia
        </p>
        <p
          className={isActive("/calendar") ? styles.Active : ""}
          onClick={() => handleReroute("/calendar")}
          style={{ cursor: "pointer" }}
        >
          Kalendarz
        </p>
      </div>
    </div>
  );
};
export default Sidebar;
