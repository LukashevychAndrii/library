import React from "react";
import styles from "./Theme.module.scss";

const Theme = () => {
  return (
    <form className={styles["toggle-btn"]}>
      <input
        className={styles["toggle-btn__input"]}
        type="checkbox"
        name="theme-btn-checkbox"
        id="theme-btn-checkbox"
      />
      <label htmlFor="theme-btn-checkbox">
        <div className={styles["toggle-btn__shifter__wrapper"]}></div>
        <div className={styles["toggle-btn__shifter"]}></div>
      </label>
    </form>
  );
};

export default Theme;
