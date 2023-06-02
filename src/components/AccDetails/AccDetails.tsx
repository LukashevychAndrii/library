import React from "react";
import styles from "./AccDetails.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Edit } from "../../img/SVG/write.svg";
import { ReactComponent as Copy } from "../../img/SVG/content_copy.svg";

import { getAuth, signOut } from "firebase/auth";
import { createAlert } from "../../store/slices/alert-slice";
import { removeUserData } from "../../store/slices/user-slice";

const AccDetails = () => {
  const [copied, SetCopied] = React.useState(false);
  const accDetails = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const userIDRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (!accDetails.userID) {
      navigate("/library");
    }
  }, [accDetails, navigate]);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => {
        SetCopied(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  function signOutClickHandler() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(
          createAlert({
            alertTitle: "Success!",
            alertText: "Successfully signed out",
            alertType: "success",
          })
        );
        dispatch(removeUserData());
      })
      .catch((error) => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Sign out failed",
            alertType: "error",
          })
        );
      });
  }

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      theme-acc-details__wrapper={theme}
      className={styles["acc-details__wrapper"]}
    >
      <div theme-acc-details={theme} className={styles["acc-details"]}>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>Name: </div>
          <div>{accDetails.userName}</div>
          <Edit />
        </div>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>Email:</div>
          <div> {accDetails.email}</div>
          <Edit />
        </div>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>Password: </div>
          <div>{accDetails.password}</div>
          <Edit />
        </div>
        <div
          theme-acc-details__row={theme}
          className={styles["acc-details__row__wrapper"]}
        >
          <div>ID: </div>
          <div ref={userIDRef}>{accDetails.userID}</div>
          <Copy
            style={{ width: "18px", height: "18px" }}
            onClick={() => {
              SetCopied(true);
            }}
          />
        </div>

        <button
          className={`btn ${theme === "dark" ? "btn--dark" : "btn--light"} ${
            styles["acc-details__btn"]
          }`}
          onClick={signOutClickHandler}
        >
          Sign Out
        </button>
      </div>
      <div
        theme-acc-details={theme}
        className={`${styles["acc-details__copy"]} ${
          copied && styles["acc-details__copy__animation"]
        }`}
      >
        Copied to clipboard
      </div>
    </div>
  );
};

export default AccDetails;
