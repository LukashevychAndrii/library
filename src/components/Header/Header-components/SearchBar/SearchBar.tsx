import React from "react";
import styles from "./SearchBar.module.scss";
import { useAppDispatch } from "../../../../hooks/redux";
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
          setPlaceholder("Enter pages count...");
          break;
        case "year":
          setPlaceholder("Enter years...");
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
        placeholder={placeholder}
        value={enteredValue}
        onChange={(e) => setEnteredValue(e.target.value)}
      />
      <label htmlFor=""></label>
    </form>
  );
};

export default SearchBar;
