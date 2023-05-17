import React from "react";
import styles from "./BookList.module.scss";
import { book } from "../../pages/HomePage";
import { useLoaderData } from "react-router-dom";
import BookItem from "./BookItem";

const BookList = () => {
  const books = useLoaderData() as book[];
  return (
    <ul className={styles["books-list"]}>
      {books.map((el) => (
        <BookItem key={el.id} book={el}></BookItem>
      ))}
    </ul>
  );
};

export default BookList;
