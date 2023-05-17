import React from "react";
import styles from "./BookItem.module.scss";
import { book } from "../../pages/HomePage";

const BookItem: React.FC<{ book: book }> = ({ book }) => {
  return <li>{book.author}</li>;
};

export default BookItem;
