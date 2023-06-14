import React from "react";
import styles from "./Error..module.scss";
import { useAppSelector } from "../../hooks/redux";

import PAGE_NOT_FOUND_ICON from "../../img/PNG/page_not_found.png";
import { Link } from "react-router-dom";

const Error = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div theme-error-page={theme} className={styles["error"]}>
      <div className={styles["error__content"]}>
        <span className={styles["error__heading"]}>Page not Found!</span>
        <img
          src={PAGE_NOT_FOUND_ICON}
          alt="page not found"
          className={styles["error__icon"]}
        />
        <Link to="/library" className={styles["error__home-link"]}>
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
