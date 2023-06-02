import React from "react";
import styles from "./BookItem.module.scss";
import { Link } from "react-router-dom";

import { ReactComponent as Heart } from "../../img/SVG/heart.svg";
import { ReactComponent as HeartOutlined } from "../../img/SVG/heart-outlined.svg";
import { ReactComponent as Attachment } from "../../img/SVG/attachment.svg";
import { ReactComponent as Pin } from "../../img/SVG/pin.svg";
import {
  book,
  addBookToWishlist,
  removeBookFromWishlist,
  pinBook,
  unpinBook,
} from "../../store/slices/book-slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

interface props {
  book: book;
}
const BookItem: React.FC<props> = ({ book }) => {
  const dispatch = useAppDispatch();

  const [imageSrc, setImageSrc] = React.useState("");

  const [liked, setLiked] = React.useState<boolean>(false);
  const wishlist = useAppSelector((state) => state.book.wishlist);

  const [pinned, setPinned] = React.useState<boolean>(false);
  const pinnedBooks = useAppSelector((state) => state.book.pinnedBooks);

  React.useEffect(() => {
    import(`./${book.imageLink}`).then((module) => {
      setImageSrc(module.default);
    });
  }, [imageSrc, book.imageLink]);
  React.useEffect(() => {
    if (wishlist && wishlist.findIndex((el) => el.id === book.id) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [wishlist, book.id]);

  React.useEffect(() => {
    console.log(pinnedBooks.length);
    if (
      pinnedBooks &&
      pinnedBooks.findIndex((el) => el.id === book.id) !== -1
    ) {
      if (pinnedBooks.length <= 5) setPinned(true);
    } else {
      setPinned(false);
    }
  }, [book.id, pinnedBooks]);

  const ref = React.useRef<HTMLInputElement>(null);
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <li theme-list-item={theme} className={styles["book"]}>
      <img className={styles["book__image"]} src={imageSrc} alt="book" />
      <div className={styles["book__description"]}>
        <h1>
          <Link
            style={{ width: "80%" }}
            className={`heading-1 heading-1--${theme}`}
            to={`${book.id}`}
          >
            {book.title}
          </Link>
        </h1>
        <h2 className={`heading-2 heading-2--${theme}`}>{book.author}</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. At molestias
          maiores tempora voluptate.
        </p>
        <Link
          to={`${book.id}`}
          className={`btn-more--${theme === "light" ? "dark" : "light"} ${
            styles["book__btn-more"]
          }`}
        >
          Details &rarr;
        </Link>
      </div>

      <form>
        <input
          type="checkbox"
          name={`pin-${book.id}`}
          id={`pin-${book.id}`}
          style={{ display: "none" }}
          checked={pinned}
          onChange={(e) => {
            if (e.target.checked) {
              dispatch(pinBook({ bookData: book }));
            } else {
              dispatch(unpinBook({ bookID: book.id }));
            }
          }}
        />
        <label htmlFor={`pin-${book.id}`}>
          {
            <Pin
              pin-theme={theme}
              className={`${styles["book__pin-icon"]} ${
                styles[`book__${pinned ? "pin" : "unpin"}`]
              }`}
            />
          }
        </label>
        <input
          ref={ref}
          type="checkbox"
          name={`heart-${book.id}`}
          id={`heart-${book.id}`}
          className={styles["book__checkbox"]}
          checked={liked}
          onChange={(e) => {
            setLiked(!liked);
            if (e.target.checked) {
              dispatch(
                addBookToWishlist({ bookID: `${book.id}`, bookData: book })
              );
            } else {
              dispatch(removeBookFromWishlist({ bookID: `${book.id}` }));
            }
          }}
        />
        <label htmlFor={`heart-${book.id}`}>
          {liked ? (
            <>
              <Heart className={styles["book__heart"]} />
            </>
          ) : (
            <HeartOutlined
              className={`${styles["book__heart"]} ${styles["book__heart--outlined"]}`}
            />
          )}
        </label>
      </form>
    </li>
  );
};

export default BookItem;
