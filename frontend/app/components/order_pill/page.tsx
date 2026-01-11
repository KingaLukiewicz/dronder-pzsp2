"use client";
import styles from "./page.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/navigation";

type OrderPillProps = {
  id: number;
  title: string;
  deadline: string;
};

const OrderPill = ({ id, title, deadline }: OrderPillProps) => {
  const router = useRouter();

  const handleReroute = () => {
    router.push(`/order_page/${id}`);
  };

  return (
    <div className={styles.OrderPill}>
      <div className={styles.Left}>
        <p>{title}</p>
        <p>deadline: {deadline}</p>
      </div>
      <div className={styles.Right} onClick={handleReroute}>
        <p>Zobacz szczegóły</p>
        <ArrowForwardIosIcon className={styles.Arrow} />
      </div>
    </div>
  );
};
export default OrderPill;
