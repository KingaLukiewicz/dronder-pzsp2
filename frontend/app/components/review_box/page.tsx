"use client";

import { Rating, Tooltip } from "@mui/material";
import styles from "./page.module.css";

const ReviewBox = () => {
  return (
    <div className={styles.ReviewBox}>
      <div className={styles.Author}>
        <p>Author</p>
        <Tooltip placement="top" title={`${(4.5).toFixed(1)} / 5`}>
          <span>
            <Rating name="read-only" value={4.5} precision={0.5} readOnly />
          </span>
        </Tooltip>
      </div>
      <div className={styles.Content}>
        <p>
          Nam magna turpis, bibendum varius risus ac, efficitur fringilla orci.
        </p>
      </div>
    </div>
  );
};
export default ReviewBox;
