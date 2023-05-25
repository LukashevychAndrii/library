import React from "react";
import styles from "./MainHeader.module.scss";
import { NavLink } from "react-router-dom";
import { ReactComponent as BookIcon } from "../../img/SVG/book1.svg";
import Acc from "./Header-components/Acc/Acc";
import { useAppSelector } from "../../hooks/redux";
import Theme from "./Header-components/Theme/Theme";
import SearchBar from "./Header-components/SearchBar/SearchBar";
import Wishlist from "./Header-components/Wishlist/Wishlist";

export const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${styles["header__item--active"]} ${styles["header__item"]}`
    : styles["header__item"];

const MainHeader = () => {
  const userName = useAppSelector((state) => state.user.userName);

  const theme = useAppSelector((state) => state.theme.theme);

  const userID = useAppSelector((state) => state.user.userID);

  return (
    <header theme-header={theme} className={styles["header"]}>
      <NavLink end className={getStyle} to="/library">
        <BookIcon />
        <div>Books</div>
      </NavLink>
      {userID && <Wishlist />}
      <SearchBar />
      <div className={styles["header__right-content"]}>
        <Theme />
        <div className={styles["header__acc"]}>
          {userName ? (
            <NavLink className={getStyle} to="/library/acc-details">
              {userName}
            </NavLink>
          ) : (
            <Acc />
          )}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
