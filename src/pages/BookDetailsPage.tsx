import React from "react";
import BookDetails from "../components/Home/BookDetails";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { getBookDetails } from "../store/slices/book-slice";

const BookDetailsPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (params && params.bookID) {
      dispatch(getBookDetails({ bookID: params.bookID, navigate: navigate }));
    }
  }, [params, dispatch, navigate]);
  return <BookDetails />;
};

export default BookDetailsPage;
