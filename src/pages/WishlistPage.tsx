import React from "react";
import BookList from "../components/Home/BookList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useLocation, useNavigate } from "react-router-dom";
import { book } from "../store/slices/book-slice";
import PinnedBooks from "../components/Header/Header-components/Wishlist/PinnedBooks";

const WishlistPage = () => {
  const books = useAppSelector((state) => state.book.wishlist);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const [slicedBooks, setSlicesBooks] = React.useState<book[]>([]);

  const count = useAppSelector((state) => state.book.totalWishlistLength);
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth", left: 0 });
    if (pageParam) {
      const end = +pageParam * 10;
      const start = end - 10;
      setSlicesBooks(books.slice(start, end));
    } else {
      setSlicesBooks(books.slice(0, 10));
    }
  }, [pageParam, books, count]);

  const userID = useAppSelector((state) => state.user.userID);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!userID) {
      navigate("/library");
    }
  }, [userID, navigate]);

  return (
    <>
      <PinnedBooks />
      <BookList books={slicedBooks} count={count} />
    </>
  );
};

export default WishlistPage;
