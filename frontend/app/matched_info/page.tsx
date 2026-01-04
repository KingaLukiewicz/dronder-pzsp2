import { Tooltip, Rating, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./page.module.css";

type Props = {
  title: string;
  description: string;
  rating: number;
  vote_count: number;
};

const MatchedInfo = ({ title, description, rating, vote_count }: Props) => {
  return (
    <div className={styles.MatchedInfo}>
      <div className={styles.TitleRow}>
        <h2>{title}</h2>
        <div className={styles.Actions}>
          <IconButton size="small" color="success">
            <CheckIcon />
          </IconButton>
          <IconButton size="small" color="error">
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <div className={styles.Description}>{description}</div>
      <div className={styles.Rating}>
        {rating && vote_count && (
          <>
            <div className={styles.StarRating}>
              <Tooltip placement="top" title={`${rating.toFixed(1)} / 5`}>
                <span>
                  <Rating
                    name="read-only"
                    value={rating}
                    precision={0.1}
                    readOnly
                  />
                </span>
              </Tooltip>
            </div>
            <p>{`${vote_count} ocen`}</p>
          </>
        )}
      </div>
    </div>
  );
};
export default MatchedInfo;
