"use client";

import { Rating, Tooltip } from "@mui/material";
import { Review } from "../types";
import styles from "./page.module.css";

type ReviewBoxProps = {
  review: Review;
};

const ReviewBox = ({ review }: ReviewBoxProps) => {
  const ratingValue = review.rating ?? 0;

  return (
    <div className={styles.ReviewBox}>
      <div className={styles.Author}>
        <p>{review.reviewer ?? "Anonymous"}</p>
        <Tooltip placement="top" title={`${ratingValue.toFixed(1)} / 5`}>
          <span>
            <Rating
              name="read-only"
              value={ratingValue}
              precision={0.5}
              readOnly
            />
          </span>
        </Tooltip>
      </div>

      <div className={styles.Content}>
        <p>{review.review ?? "..."}</p>
      </div>
    </div>
  );
};

export default ReviewBox;
