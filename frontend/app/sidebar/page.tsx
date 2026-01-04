"use client";
import styles from "./page.module.css";

const Sidebar = () => {
  return (
    <div className={styles.Sidebar}>
      <div className={styles.Nav}>
        <p>Mój profil</p>
        <p>Dopasowane zlecenia</p>
        <p>Moje zlecenia</p>
        <p>Kalendarz</p>
      </div>
    </div>
  );
};
export default Sidebar;
