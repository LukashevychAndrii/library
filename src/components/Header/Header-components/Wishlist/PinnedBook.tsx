import React from "react";
import styles from "./PinnedBooks.module.scss";
import { book } from "../../../../store/slices/book-slice";
import { useAppSelector } from "../../../../hooks/redux";

const PinnedBook: React.FC<{ pBook: book }> = ({ pBook }) => {
  const [image, setImage] = React.useState("");
  React.useEffect(() => {
    import(`../../../Home/${pBook.imageLink}`).then((module) => {
      setImage(module.default);
    });
  }, [pBook]);

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <li className={styles["pinned-books__item"]}>
      <div
        className={`${styles["pinned-books__item__side"]} ${styles["pinned-books__item__side--front"]}`}
      >
        <img
          className={styles["pinned-books__item__image"]}
          src={image}
          alt="pinned book"
        />
      </div>
      <div
        theme-pinned-book={theme}
        className={`${styles["pinned-books__item__side"]} ${styles["pinned-books__item__side--back"]}`}
      >
        <h1 className={styles["pinned-books__item__title"]}>{pBook.title}</h1>
        <h2 className={styles["pinned-books__item__author"]}>{pBook.author}</h2>
        <p className={styles["pinned-books__item__description"]}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit ea
          sunt ducimus corporis nemo labore, corrupti qui consequuntur magni
          debitis, explicabo maxime a totam dolorem!
        </p>
        <div className={styles["pinned-books__item__language"]}>
          {pBook.language}
        </div>
        <div className={styles["pinned-books__item__pages"]}>{pBook.pages}</div>
        <div className={styles["pinned-books__item__link"]}>
          For more information -{" "}
          <a target="_blank" rel="noreferrer" href={pBook.link}>
            read this
          </a>
        </div>
      </div>
    </li>
  );
};

export default PinnedBook;
