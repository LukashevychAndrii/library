import React from "react";
import styles from "./Theme.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleTheme } from "../../../../store/slices/theme-slice";

const Theme = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

  return (
    <form className={styles["toggle-btn"]}>
      <input
        className={styles["toggle-btn__input"]}
        type="checkbox"
        name="theme-btn-checkbox"
        id="theme-btn-checkbox"
        checked={theme === "dark"}
        onChange={() => {
          dispatch(toggleTheme());
          localStorage.setItem(
            "theme-library",
            theme === "dark" ? "light" : "dark"
          );
        }}
      />
      <label htmlFor="theme-btn-checkbox">
        <div className={styles["toggle-btn__shifter__wrapper"]}></div>
        <div className={styles["toggle-btn__shifter"]}></div>
      </label>
    </form>
  );
};

export default Theme;
