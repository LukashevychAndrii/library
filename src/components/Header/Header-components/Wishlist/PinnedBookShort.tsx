import React from "react";
import { book, unpinBook } from "../../../../store/slices/book-slice";
import styles from "./Wishlist.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { Link, useNavigate } from "react-router-dom";

const PinnedBookShort: React.FC<{ pinnedBook: book }> = ({ pinnedBook }) => {
  const [imageSrc, setImageSrc] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    import(`../../../Home/${pinnedBook.imageLink}`).then((module) => {
      setImageSrc(module.default);
    });
  }, [pinnedBook]);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <li theme-wishlist-item={theme} className={styles["wishlist__item"]}>
      <img
        className={styles["wishlist__img"]}
        src={imageSrc}
        alt="liked book"
      />
      <div className={styles["wishlist__description"]}>
        <h1>
          <Link
            theme-heading-border={theme}
            className={` ${styles["wishlist__heading-1"]}`}
            to={`/library/${pinnedBook.id}`}
          >
            {pinnedBook.title}
          </Link>
        </h1>
        <h2
          onClick={() => {
            const queryParams = new URLSearchParams();
            queryParams.set("categorie", "author");
            queryParams.set("enteredValue", pinnedBook.author);

            navigate(`/library?${queryParams}`);
          }}
          theme-heading-border={theme}
          className={`${styles["wishlist__heading-2"]}`}
        >
          {pinnedBook.author}
        </h2>
        <Link
          to={`/library/${pinnedBook.id}`}
          className={`btn-more--${theme === "light" ? "dark" : "light"} ${
            styles["wishlist__details-btn"]
          }`}
        >
          Details <span>&rarr;</span>
        </Link>
      </div>
      <span
        onClick={() => {
          dispatch(unpinBook({ bookID: pinnedBook.id }));
        }}
        className={styles["wishlist__remove-btn"]}
      >
        &times;
      </span>
    </li>
  );
};

export default PinnedBookShort;
