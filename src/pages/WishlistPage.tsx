import React from "react";
import BookList from "../components/Home/BookList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  book,
  fetchWishlist,
  setWishlistLength,
} from "../store/slices/book-slice";
import PinnedBooks from "../components/Header/Header-components/Wishlist/PinnedBooks";

const WishlistPage = () => {
  const books = useAppSelector((state) => state.book.wishlist);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const searchParams = React.useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  const pageParam = searchParams.get("page");
  const [slicedBooks, setSlicesBooks] = React.useState<book[]>([]);

  const count = useAppSelector((state) => state.book.totalWishlistLength);

  React.useEffect(() => {
    console.log("///////////");
    console.log(count);
    console.log("///////////");
  }, [count]);

  React.useEffect(() => {
    if (!location.search) {
      dispatch(fetchWishlist());
    }
  }, [location, dispatch]);

  React.useEffect(() => {}, [pageParam, books, count]);

  const userID = useAppSelector((state) => state.user.userID);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!userID) {
      navigate("/library");
    }
  }, [userID, navigate]);

  React.useEffect(() => {
    const enteredValue = searchParams.get("enteredValue");
    const comparison = searchParams.get("comparison");
    const categorie = searchParams.get("categorie");
    const page = searchParams.get("page");
    if (categorie && enteredValue) {
      if (page) {
        if (comparison) {
          //
        } else {
          const filteredBooks = books.filter((el) =>
            el[categorie as keyof book].toString().includes(enteredValue)
          );
          const end = +page * 10;
          const start = end - 10;
          setSlicesBooks(filteredBooks.slice(start, end));
          dispatch(setWishlistLength(filteredBooks.length));
        }
      } else {
        const filteredBooks = books.filter((el) =>
          el[categorie as keyof book].toString().includes(enteredValue)
        );
        setSlicesBooks(filteredBooks.slice(0, 10));
        dispatch(setWishlistLength(filteredBooks.length));
      }
    } else {
      if (page) {
        const end = +page * 10;
        const start = end - 10;
        setSlicesBooks(books.slice(start, end));
        console.log(books.slice(start, end));
      } else {
        setSlicesBooks(books.slice(0, 10));
      }
    }
  }, [searchParams, dispatch]);

  return (
    <>
      <PinnedBooks />
      <BookList books={slicedBooks} count={count} />
    </>
  );
};

export default WishlistPage;
