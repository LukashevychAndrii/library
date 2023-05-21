import React from "react";
import BookList from "../components/Home/BookList";
import { useAppDispatch } from "../hooks/redux";
import { fetchBooks } from "../store/slices/book-slice";

const HomePage = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(fetchBooks({ start: "0", end: "9" }));
  }, [dispatch]);
  return <BookList />;
};

export default HomePage;

export interface book {
  author: string;
  country: string;
  imageLink: string;
  language: string;
  link: string;
  pages: number;
  title: string;
  year: number;
  id: number;
  liked: boolean;
}
