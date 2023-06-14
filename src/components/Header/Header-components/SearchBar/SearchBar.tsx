import React from "react";
import styles from "./SearchBar.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
  fetchBooks,
  fetchFilteredBooks,
  getBooksLength,
} from "../../../../store/slices/book-slice";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [enteredValue, setEnteredValue] = React.useState("");

  const [placeholder, setPlaceholder] = React.useState("Enter author name...");
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categorie = searchParams.get("categorie");
    const enteredValue = searchParams.get("enteredValue");
    const comparison = searchParams.get("comparison");

    if (enteredValue) setEnteredValue(enteredValue);
    if (categorie) {
      switch (categorie) {
        case "title":
          setPlaceholder("Enter title...");
          break;
        case "author":
          setPlaceholder("Enter author name...");
          break;
        case "pages":
          if (comparison === "less") {
            setPlaceholder("Enter pages count (less than) ...");
          } else if (comparison === "more") {
            setPlaceholder("Enter pages count (more than) ...");
          }
          break;
        case "year":
          if (comparison === "earlier") {
            setPlaceholder("Enter years (earlier) ...");
          } else if (comparison === "later") {
            setPlaceholder("Enter years (later) ...");
          }
          break;
        case "country":
          setPlaceholder("Enter country name...");
          break;
        case "language":
          setPlaceholder("Enter language...");
          break;
        default:
          setPlaceholder("Enter author name...");
          break;
      }
    }
  }, [location]);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (enteredValue.trim().length > 0) {
          const searchParams = new URLSearchParams(location.search);

          // const comparison = searchParams.get("comparison");
          const categorie = searchParams.get("categorie");
          // const page = searchParams.get("page");
          if (!categorie) {
            searchParams.set("categorie", "title");
          }
          searchParams.set("enteredValue", enteredValue);
          searchParams.delete("page");
          // if (comparison) {
          //   dispatch(
          //     fetchFilteredBooks({
          //       filter: categorie ? categorie : "title",
          //       enteredValue: enteredValue,
          //       comparison: comparison,
          //       page: page ? +page : 1,
          //     })
          //   );
          // } else {
          //   dispatch(
          //     fetchFilteredBooks({
          //       filter: categorie ? categorie : "title",
          //       enteredValue: enteredValue,
          //       page: page ? +page : 1,
          //     })
          //   );
          // }
          navigate(`?${searchParams}`);
        } else {
          const queryParams = new URLSearchParams(location.search);
          queryParams.delete("enteredValue");
          navigate(`/library`);

          dispatch(fetchBooks({ start: "0", end: "9" }));
          dispatch(getBooksLength());
        }
      }}
      className={styles["search-bar"]}
    >
      <input
        className={styles["search-bar__input"]}
        type="text"
        placeholder=" "
        value={enteredValue}
        onChange={(e) => setEnteredValue(e.target.value)}
        id="searchbar"
      />
      <span
        theme-searchbar-border={theme}
        className={styles["search-bar__border"]}
      >
        <i></i>
      </span>
      <label
        theme-searchbar-label={theme}
        className={styles["search-bar__label"]}
        htmlFor="searchbar"
      >
        {placeholder}
      </label>
    </form>
  );
};

export default SearchBar;
