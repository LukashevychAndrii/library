import React from "react";
import styles from "./BookList.module.scss";
import { book } from "../../pages/HomePage";
import { useLoaderData } from "react-router-dom";
import BookItem from "./BookItem";
import { useAppSelector } from "../../hooks/redux";

const BookList = () => {
  const books = useLoaderData() as book[];

  const MemoizedBookItem = React.memo(BookItem);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div theme-list={theme}>
      <ul className={styles["books-list"]}>
        {books.map((el, index) => {
          while (index < 10) {
            return <BookItem key={el.id} book={el}></BookItem>;
          }
        })}
      </ul>
    </div>
  );
};

export default BookList;
