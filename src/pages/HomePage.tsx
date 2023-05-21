import React from "react";
import BookList from "../components/Home/BookList";
import { useAppDispatch } from "../hooks/redux";
import { fetchBooks } from "../store/slices/book-slice";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const page = useLocation();
  const searchParams = new URLSearchParams(page.search);
  const pageParam = searchParams.get("page");
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
  }, [pageParam, dispatch]);
  return <BookList />;
};

export default HomePage;
