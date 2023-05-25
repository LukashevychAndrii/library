import React from "react";
import BookList from "../components/Home/BookList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  clearCurrentBookDetails,
  fetchBooks,
  fetchFilteredBooks,
  getBooksLength,
} from "../store/slices/book-slice";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const authorParams = searchParams.get("author");
  const books = useAppSelector((state) => state.book.books);

  React.useEffect(() => {
    if (!authorParams) {
      dispatch(getBooksLength());
    }
  }, [dispatch, authorParams]);

  React.useEffect(() => {
    if (pageParam) {
      const start: number = +pageParam * 10 - 10;
      const end = start + 9;
      if (typeof start === "number" && typeof end === "number") {
        dispatch(fetchBooks({ start: `${start}`, end: `${end}` }));
      }
    } else {
      dispatch(fetchBooks({ start: "0", end: "9" }));
    }
  }, [pageParam, dispatch, authorParams]);
  React.useEffect(() => {
    if (authorParams) {
      dispatch(
        fetchFilteredBooks({ filter: "author", enteredValue: authorParams })
      );
    }
  }, [authorParams, dispatch]);

  React.useEffect(() => {
    dispatch(clearCurrentBookDetails());
  }, [dispatch]);
  const count = useAppSelector((state) => state.book.totalLength);

  return <BookList books={books} count={count} />;
};

export default HomePage;
