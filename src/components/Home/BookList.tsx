import React from "react";
import styles from "./BookList.module.scss";
import { book } from "../../store/slices/book-slice";
import { Link } from "react-router-dom";
import BookItem from "./BookItem";
import { useAppSelector } from "../../hooks/redux";
import Pagination from "../Pagination/Pagination";

import books_nout_found from "../../img/PNG/books_not_found.png";
import ArrowToTop from "../ArrowToTop/ArrowToTop";
const BookList: React.FC<{ books: book[]; count: number }> = ({
  books,
  count,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <>
      <ArrowToTop />
      <div theme-list={theme}>
        <ul className={styles["books-list"]}>
          {books.length > 0 ? (
            books.map((el, index) => {
              return <BookItem key={el.id} book={el}></BookItem>;
            })
          ) : (
            <div
              theme-list__empty={theme}
              className={styles["books-list__empty"]}
            >
              <div>No books found!</div>
              <img
                className={styles["books-list__empty__img"]}
                src={books_nout_found}
                alt="no books found"
              />
              <Link className={styles["books-list__empty__link"]} to="/library">
                Back to all
              </Link>
            </div>
          )}
        </ul>
        <Pagination totalLength={count} />
      </div>
    </>
  );
};

export default BookList;
