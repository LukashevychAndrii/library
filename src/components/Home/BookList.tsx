import React from "react";
import styles from "./BookList.module.scss";
import { book } from "../../store/slices/book-slice";
import { useLoaderData } from "react-router-dom";
import BookItem from "./BookItem";
import { useAppSelector } from "../../hooks/redux";
import Pagination from "../Pagination/Pagination";

const BookList: React.FC<{ books: book[]; count: number }> = ({
  books,
  count,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div theme-list={theme}>
      <ul className={styles["books-list"]}>
        {books.length > 0 &&
          books.map((el, index) => {
            return <BookItem key={el.id} book={el}></BookItem>;
          })}
      </ul>
      <Pagination totalLength={count} />
    </div>
  );
};

export default BookList;
