import React from "react";
import styles from "./SearchBar.module.scss";
import { useAppSelector } from "../../../../hooks/redux";
import { useLocation, useNavigate } from "react-router-dom";
import { removeSearchParams } from "../../../../utils/removeSearchParams";

const SearchBar = () => {
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
        setPlaceholder("Enter title name...");
        break;
    }
  }, [location]);

  const theme = useAppSelector((state) => state.theme.theme);

  const pathname = removeSearchParams();

  const handleSubmit = (): void => {
    if (enteredValue.trim().length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const pathName = new URLSearchParams(location.pathname);

      const categorie = searchParams.get("categorie");
      searchParams.set("enteredValue", enteredValue);
      searchParams.delete("page");
      if (!categorie) {
        searchParams.set("categorie", "title");
      }

      if (pathName.toString().includes("wishlist")) {
        navigate("/wishlist");
      } else {
        navigate("/library");
      }
      navigate(`?${searchParams}`);
    } else {
      navigate(pathname);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
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
