import React from "react";
import BookList from "../components/Home/BookList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchWishlist, setBooksLength } from "../store/slices/book-slice";
import { useLocation } from "react-router-dom";

const WishlistPage = () => {
  const books = useAppSelector((state) => state.book.wishlist);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const userID = useAppSelector((state) => state.user.userID);

  React.useEffect(() => {
    if (books.length > 0) {
      dispatch(setBooksLength({ totalLength: books.length }));
    }
  }, [books, dispatch]);
  React.useEffect(() => {
    if (userID) {
      if (pageParam) {
        console.log(pageParam);

        const start: number = +pageParam * 10 - 10;
        const end = start + 9;
        if (typeof start === "number" && typeof end === "number") {
          dispatch(fetchWishlist({ start: `${start}`, end: `${end}` }));
        }
      } else {
        dispatch(fetchWishlist({ start: "0", end: "9" }));
      }
    }
  }, [pageParam, dispatch, userID]);

  const count = useAppSelector((state) => state.book.totalWishlistLength);
  console.log(count);

  return <BookList books={books} count={count} />;
};

export default WishlistPage;
