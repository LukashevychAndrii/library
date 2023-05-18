import React from "react";
import styles from "./MainHeader.module.scss";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as BookIcon } from "../../img/SVG/book1.svg";
import Acc from "./Header-components/Acc/Acc";
import { useAppSelector } from "../../hooks/redux";

export const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${styles["header__item--active"]} ${styles["header__item"]}`
    : styles["header__item"];

const MainHeader = () => {
  const userID = useAppSelector((state) => state.user.userID);
  return (
    <header className={styles["header"]}>
      <NavLink className={getStyle} to="/library">
        <BookIcon />
        <div>Books</div>
      </NavLink>
      <div className={styles["header__acc"]}>
        {userID ? <div>qwe</div> : <Acc />}
      </div>
    </header>
  );
};

export default MainHeader;
