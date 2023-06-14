import React from "react";
import styles from "./Navigation.module.scss";
import { useAppSelector } from "../../hooks/redux";
import { Link } from "react-router-dom";

const Navigation = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const scroll = useAppSelector((state) => state.scroll.scrolledALittle);

  const [checked, setChecked] = React.useState(false);

  return (
    <div className={styles["navigation"]}>
      <form>
        <input
          type="checkbox"
          id="navi-toggle"
          className={styles["navigation__checkbox"]}
          checked={checked}
          onChange={() => {
            setChecked(!checked);
          }}
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
              <Link
                onClick={() => {
                  setChecked(false);
                }}
                to="/library"
                className={styles["navigation__link"]}
              >
                All Books
              </Link>
            </li>
            <li className={styles["navigation__item"]}>
              <Link
                onClick={() => {
                  setChecked(false);
                }}
                to="/acc-detail"
                className={styles["navigation__link"]}
              >
                Account Details
              </Link>
            </li>
            <li className={styles["navigation__item"]}>
              <Link
                onClick={() => {
                  setChecked(false);
                }}
                to="/wishlist"
                className={styles["navigation__link"]}
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </nav>
      </form>
    </div>
  );
};

export default Navigation;
