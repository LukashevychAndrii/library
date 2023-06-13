import React from "react";
import styles from "./Navigation.module.scss";
import { useAppSelector } from "../../hooks/redux";

const Navigation = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const scroll = useAppSelector((state) => state.nav.scrolledALittle);
  return (
    <div className={styles["navigation"]}>
      <form>
        <input
          type="checkbox"
          id="navi-toggle"
          className={styles["navigation__checkbox"]}
        />
        <label
          theme-nav={theme}
          htmlFor="navi-toggle"
          className={`${styles["navigation__button"]} ${
            !scroll && styles["navigation__button__indented"]
          }`}
        >
          <span theme-nav-icon={theme} className={styles["navigation__icon"]}>
            &nbsp;
          </span>
        </label>
        <div
          theme-nav-background={theme}
          className={`${styles["navigation__background"]} ${
            !scroll && styles["navigation__background__indented"]
          }`}
        >
          &nbsp;
        </div>
        <nav className={styles["navigation__nav"]}>
          <ul
            theme-nav-link-text={theme}
            className={styles["navigation__list"]}
          >
            <li className={styles["navigation__item"]}>
              <a href="#" className={styles["navigation__link"]}>
                Account Details
              </a>
            </li>
            <li className={styles["navigation__item"]}>
              <a href="#" className={styles["navigation__link"]}>
                Wishlist
              </a>
            </li>
            <li className={styles["navigation__item"]}>
              <a href="#" className={styles["navigation__link"]}>
                Wishlist
              </a>
            </li>
          </ul>
        </nav>
      </form>
    </div>
  );
};

export default Navigation;
