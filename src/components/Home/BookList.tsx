import React from "react";
import styles from "./BookList.module.scss";
import { book } from "../../pages/HomePage";
import { useLoaderData } from "react-router-dom";
import BookItem from "./BookItem";
import { useAppSelector } from "../../hooks/redux";

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
      <div className={styles[""]}>
        <ul>
          <li>
            <button>1</button>
          </li>
          <li>
            <button>2</button>
          </li>
          <li>
            <button>3</button>
          </li>
          <li>
            <button>4</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BookList;
