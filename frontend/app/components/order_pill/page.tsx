"use client";
import styles from "./page.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type OrderPillProps = {
  title: string;
  deadline: string;
};

const OrderPill = ({ title, deadline }: OrderPillProps) => {
  return (
    <div className={styles.OrderPill}>
      <div className={styles.Left}>
        <p>{title}</p>
        <p>deadline: {deadline}</p>
      </div>
      <div className={styles.Right}>
        <p>Zobacz szczegóły</p>
        <ArrowForwardIosIcon className={styles.Arrow} />
      </div>
    </div>
  );
};
export default OrderPill;
