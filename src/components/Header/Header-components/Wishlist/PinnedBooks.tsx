import React from "react";
import styles from "./PinnedBooks.module.scss";
import { useAppSelector } from "../../../../hooks/redux";

import { ReactComponent as LeftArrow } from "../../../../img/SVG/navigate_before.svg";
import { ReactComponent as RightArrow } from "../../../../img/SVG/navigate_next.svg";
import PinnedBook from "./PinnedBook";
const PinnedBooks = () => {
  const pinnedBooks = useAppSelector((state) => state.book.pinnedBooks);
  const bookWidth = React.useRef<number>(40);
  const [maxOffset, setMaxOffset] = React.useState(0);
  const [newB, setNewB] = React.useState(-1);

  const [offset, setOffset] = React.useState<number>(0);

  const [shown, setShown] = React.useState([0]);

  const theme = useAppSelector((state) => state.theme.theme);

  React.useEffect(() => {
    console.log(shown);
    if (shown.length === 3) {
      setMaxOffset(
        -bookWidth.current * (pinnedBooks.length - 2) + bookWidth.current
      );
    } else if (shown.length === 2) {
      setMaxOffset(
        -bookWidth.current * (pinnedBooks.length - 1) + bookWidth.current
      );
    } else if (shown.length === 1) {
      setMaxOffset(-bookWidth.current * pinnedBooks.length + bookWidth.current);
    }
  }, [pinnedBooks, setMaxOffset, shown]);

  React.useEffect(() => {
    if (window.innerWidth <= 1450) {
      setShown([0]);
    } else if (window.innerWidth <= 1750) {
      setShown([0, 1]);
    } else {
      setShown([0, 1, 2]);
    }
  }, []);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1450) {
        setShown([0]);
      } else if (window.innerWidth <= 1750) {
        setShown([0, 1]);
      } else {
        setShown([0, 1, 2]);
      }
      if (window.innerWidth <= 1350) {
        bookWidth.current = 35;
      } else {
        bookWidth.current = 40;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {pinnedBooks.length > 0 && (
        <div
          theme-pinned-books={theme}
          className={styles["pinned-books__wrapper"]}
        >
          <div className={styles["pinned-books__chevron__wrapper"]}>
            {pinnedBooks.length > 3 && (
              <LeftArrow
                onClick={() => {
                  setOffset((prev) => Math.min(0, (prev += bookWidth.current)));
                  setShown((prev) => {
                    const newShown: number[] = JSON.parse(JSON.stringify(prev));
                    if (newShown[0] !== 0) {
                      newShown.unshift(newShown[0] - 1);
                      newShown.pop();
                    }
                    console.log(newShown);
                    return newShown;
                  });
                }}
                theme-chevron={theme}
                className={`${styles["pinned-books__chevron"]} ${
                  styles["pinned-books__chevron--prev"]
                } ${offset >= 0 && styles["pinned-books__chevron--first"]}`}
              />
            )}

            <div className={styles["pinned-books__list-wrapper"]}>
              {/* <ul
                style={{
                  transform: `translateX(${offset}rem)`,
                  justifyContent: pinnedBooks.length < 3 ? "center" : "",
                }}
                className={styles["pinned-books"]}
              >
                {pinnedBooks.length > 0 &&
                  pinnedBooks.map((el) => (
                    <PinnedBook key={el.id} pBook={el} />
                  ))}
              </ul> */}
              <ul
                style={{
                  transform: `translateX(${offset}rem)`,
                  justifyContent: pinnedBooks.length < 3 ? "center" : "",
                }}
                className={styles["pinned-books"]}
              >
                {pinnedBooks.length > 0 &&
                  pinnedBooks.map((el, index) => (
                    <PinnedBook
                      shown={shown}
                      index={index}
                      key={el.id}
                      pBook={el}
                      newB={newB}
                    />
                  ))}
              </ul>
            </div>
            {pinnedBooks.length > 3 && (
              <RightArrow
                onClick={() => {
                  setOffset((prev) => {
                    if (prev - bookWidth.current < maxOffset) {
                      return prev;
                    }
                    return (prev -= bookWidth.current);
                  });
                  setShown((prev) => {
                    const newShown: number[] = JSON.parse(JSON.stringify(prev));
                    if (
                      newShown[newShown.length - 1] !==
                      pinnedBooks.length - 1
                    ) {
                      newShown.push(newShown[newShown.length - 1] + 1);
                      newShown.shift();
                    }
                    setNewB(newShown[0]);
                    setNewB(newShown[newShown.length - 1]);
                    return newShown;
                  });
                }}
                theme-chevron={theme}
                className={`${styles["pinned-books__chevron"]} ${
                  styles["pinned-books__chevron--next"]
                } ${
                  offset <= maxOffset && styles["pinned-books__chevron--last"]
                }`}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PinnedBooks;
