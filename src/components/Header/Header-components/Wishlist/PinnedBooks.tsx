import React from "react";
import styles from "./PinnedBooks.module.scss";
import { useAppSelector } from "../../../../hooks/redux";

import { ReactComponent as LeftArrow } from "../../../../img/SVG/navigate_before.svg";
import { ReactComponent as RightArrow } from "../../../../img/SVG/navigate_next.svg";
import PinnedBook from "./PinnedBook";
const PinnedBooks = () => {
  const pinnedBooks = useAppSelector((state) => state.book.pinnedBooks);
  const [bookWidth, setBookWidth] = React.useState(0);
  const [maxOffset, setMaxOffset] = React.useState(0);
  const [newB, setNewB] = React.useState(-1);
  React.useEffect(() => {
    setMaxOffset(-bookWidth * (pinnedBooks.length - 2) + bookWidth);
  }, [pinnedBooks, bookWidth, setMaxOffset]);

  const [offset, setOffset] = React.useState<number>(0);

  const [shown, setShown] = React.useState([0, 1, 2]);

  const theme = useAppSelector((state) => state.theme.theme);

  function getWidth(width: number) {
    setBookWidth(width / 10 + 10);
  }

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
                  setOffset((prev) => Math.min(0, (prev += bookWidth)));
                  setShown((prev) => {
                    const newShown: number[] = JSON.parse(JSON.stringify(prev));
                    if (newShown[0] !== 0) {
                      newShown.pop();
                      newShown.unshift(newShown[0] - 1);
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
                      getWidth={getWidth}
                      newB={newB}
                    />
                  ))}
              </ul>
            </div>
            {pinnedBooks.length > 3 && (
              <RightArrow
                onClick={() => {
                  setOffset((prev) => {
                    if (prev - bookWidth < maxOffset) {
                      return prev;
                    }
                    return (prev -= bookWidth);
                  });
                  setShown((prev) => {
                    const newShown: number[] = JSON.parse(JSON.stringify(prev));
                    if (
                      newShown[newShown.length - 1] !==
                      pinnedBooks.length - 1
                    ) {
                      newShown.shift();
                      newShown.push(newShown[newShown.length - 1] + 1);
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
