import React from "react";
import styles from "./Wishlist.module.scss";
import { ReactComponent as Attachment } from "../../../../img/SVG/attachment.svg";
import { useAppSelector } from "../../../../hooks/redux";
import WishlistItem from "./WishlistItem";
import { Link } from "react-router-dom";
const Wishlist = () => {
  const [hover, setHover] = React.useState(false);
  const likedBooks = useAppSelector((state) => state.book.wishlist);

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={styles["wishlist--wrapper"]}
    >
      <Link to="/wishlist" className={styles["wishlist--icon"]}>
        <Attachment />
        <span>Wishlist</span>
      </Link>
      {hover && (
        <ul theme-wishlist={theme} className={styles["wishlist"]}>
          {/* {likedBooks.map((el) => (
            <WishlistItem key={el.id} likedBook={el} />
          ))} */}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
