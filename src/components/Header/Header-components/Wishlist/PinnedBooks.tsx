import React from "react";
import styles from "./PinnedBooks.module.scss";
import { useAppSelector } from "../../../../hooks/redux";
import PinnedBook from "./PinnedBook";

import { ReactComponent as LeftArrow } from "../../../../img/SVG/navigate_before.svg";
import { ReactComponent as RightArrow } from "../../../../img/SVG/navigate_next.svg";
const PinnedBooks = () => {
  const pinnedBooks = useAppSelector((state) => state.book.pinnedBooks);
  const bookWidth = 45;
  const maxOffset = React.useRef<number>(0);

  React.useEffect(() => {
    maxOffset.current = -bookWidth * (pinnedBooks.length - 3);
  }, [pinnedBooks]);

  const [offset, setOffset] = React.useState<number>(0);

  const theme = useAppSelector((state) => state.theme.theme);

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
                }}
                theme-chevron={theme}
                className={`${styles["pinned-books__chevron"]} ${
                  styles["pinned-books__chevron--prev"]
                } ${offset >= 0 && styles["pinned-books__chevron--first"]}`}
              />
            )}

            <div className={styles["pinned-books__list-wrapper"]}>
              <ul
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
              </ul>
            </div>
            {pinnedBooks.length > 3 && (
              <RightArrow
                onClick={() => {
                  setOffset((prev) => {
                    if (prev - bookWidth < maxOffset.current) {
                      return prev;
                    }
                    return (prev -= bookWidth);
                  });
                }}
                theme-chevron={theme}
                className={`${styles["pinned-books__chevron"]} ${
                  styles["pinned-books__chevron--next"]
                } ${
                  offset <= maxOffset.current &&
                  styles["pinned-books__chevron--last"]
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
