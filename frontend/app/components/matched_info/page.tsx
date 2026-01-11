import { Tooltip, Rating, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./page.module.css";
import React, { PropsWithChildren, createContext, useContext } from "react";
import { Review } from "@/app/types";
import { useRouter } from "next/navigation";

type MatchedInfoContext = {
  user_id: number;
  title: string;
  description: string;
  reviews?: Review[];
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
  user_id: number;
  title: string;
  description: string;
  reviews?: Review[];
  onClick?: () => void;
};

type MatchedInfoComponent = React.FC<Props> & {
  Rating: React.FC;
};

const MatchedInfo: MatchedInfoComponent = ({
  children,
  user_id,
  title,
  description,
  reviews,
  onClick,
}) => {
  const router = useRouter();

  const handleGoUserPage = () => {
    router.push(`/profile/${user_id}`);
  };

  return (
    <MatchedInfoContext.Provider
      value={{ user_id, title, description, reviews }}
    >
      <div className={styles.MatchedInfo} onClick={onClick}>
        <div className={styles.TitleRow}>
          <h2
            onClick={(e) => {
              e.stopPropagation();
              handleGoUserPage();
            }}
            style={{ cursor: "pointer" }}
          >
            {title}
          </h2>
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
  const { reviews } = useMatchedInfoContext();
  const vote_count = reviews?.length ?? 0;
  const rating =
    vote_count > 0
      ? reviews!.reduce((sum, r) => sum + r.rating, 0) / vote_count
      : 0;
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
