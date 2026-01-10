import { Tooltip, Rating, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./page.module.css";
import React, { PropsWithChildren, createContext, useContext } from "react";

type MatchedInfoContext = {
  client_id: number;
  title: string;
  description: string;
  rating?: number;
  vote_count?: number;
};

const MatchedInfoContext = createContext<MatchedInfoContext | undefined>(
  undefined
);

function useMatchedInfoContext() {
  const context = useContext(MatchedInfoContext);
  if (!context) {
    throw new Error("use MatchedInfoContext must be within MatchedInfo");
  }
  return context;
}

type Props = PropsWithChildren & {
  client_id: number;
  title: string;
  description: string;
  rating?: number;
  vote_count?: number;
  onClick?: () => void;
};

type MatchedInfoComponent = React.FC<Props> & {
  Rating: React.FC;
};

const MatchedInfo: MatchedInfoComponent = ({
  children,
  client_id,
  title,
  description,
  rating,
  vote_count,
  onClick,
}) => {
  return (
    <MatchedInfoContext.Provider
      value={{ client_id, title, description, rating, vote_count }}
    >
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
        {children}
      </div>
    </MatchedInfoContext.Provider>
  );
};

MatchedInfo.Rating = function MatchedInfoName() {
  const { rating, vote_count } = useMatchedInfoContext();
  return (
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
  );
};

export default MatchedInfo;
