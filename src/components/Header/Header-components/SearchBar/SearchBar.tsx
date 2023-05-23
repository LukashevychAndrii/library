import React from "react";
import styles from "./SearchBar.module.scss";
import { useAppDispatch } from "../../../../hooks/redux";
import {
  fetchBooks,
  getBooksLength,
} from "../../../../store/slices/book-slice";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  React.useEffect(() => {
    const author = searchParams.get("author");
    if (author) {
      setEnteredValue(author);
    }
  }, []);

  const [enteredValue, setEnteredValue] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (enteredValue.trim().length > 0) {
          if (searchParams.get("author") !== enteredValue) {
            const queryParams = new URLSearchParams();
            queryParams.set("author", enteredValue);
            navigate(`?${queryParams}`);
          }
        } else {
          const queryParams = new URLSearchParams();
          queryParams.delete("author");
          navigate(``);

          dispatch(fetchBooks({ start: "0", end: "9" }));
          dispatch(getBooksLength());
        }
      }}
      className={styles["search-bar"]}
    >
      <input
        className={styles["search-bar__input"]}
        type="text"
        placeholder="Enter author name.."
        value={enteredValue}
        onChange={(e) => setEnteredValue(e.target.value)}
      />
      <label htmlFor=""></label>
    </form>
  );
};

export default SearchBar;
