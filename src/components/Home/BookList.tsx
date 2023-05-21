import React from "react";
import styles from "./BookList.module.scss";
import { book } from "../../store/slices/book-slice";
import { useLoaderData } from "react-router-dom";
import BookItem from "./BookItem";
import { useAppSelector } from "../../hooks/redux";
import Pagination from "../Pagination/Pagination";

const BookList = () => {
  const books = useAppSelector((state) => state.book.books);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div theme-list={theme}>
      <ul className={styles["books-list"]}>
        {books.length > 0 &&
          books.map((el, index) => {
            while (index < 10) {
              return <BookItem key={el.id} book={el}></BookItem>;
            }
          })}
      </ul>
      <Pagination />
    </div>
  );
};

export default BookList;
