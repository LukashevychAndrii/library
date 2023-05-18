import React from "react";
import styles from "./MainHeader.module.scss";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as BookIcon } from "../../img/SVG/book1.svg";

const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${styles["header__item--active"]} ${styles["header__item"]}`
    : styles["header__item"];

const MainHeader = () => {
  return (
    <header className={styles["header"]}>
      <NavLink className={getStyle} to="/library">
        <BookIcon />
        <div>Books</div>
      </NavLink>
    </header>
  );
};

export default MainHeader;
