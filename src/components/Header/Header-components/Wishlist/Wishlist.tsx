import React from "react";
import styles from "./Wishlist.module.scss";
import { ReactComponent as Attachment } from "../../../../img/SVG/attachment.svg";
import { useAppSelector } from "../../../../hooks/redux";
import { Link, useLocation } from "react-router-dom";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import PinnedBookShort from "./PinnedBookShort";

const Wishlist = () => {
  const [hover, setHover] = React.useState(false);
  const [current, setCurrent] = React.useState(false);
  const pinnedBooks = useAppSelector((state) => state.book.pinnedBooks);
  const location = useLocation();
  React.useEffect(() => {
    if (location.pathname.includes("wishlist")) {
      setCurrent(true);
    } else {
      setCurrent(false);
    }
  }, [location]);

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={styles["wishlist--wrapper"]}
    >
      <Link
        to="/wishlist"
        className={`${styles["wishlist__icon"]} ${
          hover && styles["wishlist--active"]
        } ${current && styles["wishlist__icon--current"]}`}
      >
        <Attachment />
        Wishlist
      </Link>

      {pinnedBooks.length > 0 && (
        <>
          <div className={hover ? styles["wishlist__wrapper"] : ""}></div>

          <ul
            theme-wishlist={theme}
            className={`${styles["wishlist"]} ${
              hover && styles["wishlist__hover"]
            }`}
          >
            <SimpleBar
              style={{ maxHeight: "350px", display: "block" }}
              forceVisible="y"
              autoHide={false}
            >
              <div className={styles["wishlist__heading"]}>Pinned books</div>
              {pinnedBooks.map((el) => (
                <PinnedBookShort key={el.id} pinnedBook={el} />
              ))}
            </SimpleBar>
          </ul>
        </>
      )}
    </div>
  );
};

export default Wishlist;
