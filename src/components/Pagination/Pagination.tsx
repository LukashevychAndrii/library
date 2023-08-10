import React from "react";
import styles from "./Pagination.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import { setScrollTop } from "../../store/slices/scroll-slice";

import { ReactComponent as IconPrev } from "../../img/SVG/navigate_before.svg";
import { ReactComponent as IconNext } from "../../img/SVG/navigate_next.svg";
import { setScrollTop } from "../../store/slices/scroll-slice";

export const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${styles["pagination__item--active"]} ${styles["pagination__item"]}`
    : styles["pagination__item"];

const Pagination: React.FC<{ totalLength: number }> = ({ totalLength }) => {
  const [current, setCurrent] = React.useState<number>(1);

  const page = useLocation();
  const [pages, setPages] = React.useState(0);

  const width = React.useRef(5);
  const [maxOffset, setMaxOffset] = React.useState<number>(0);
  // let [offset, setOffset] = React.useState<number>(0);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(page.search);
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrent(+pageParam);
      if (+pageParam > 2) {
        if (-width.current * (+pageParam - 2) < maxOffset) {
          console.log("1");

          setCurrentOffset(maxOffset);
        } else {
          console.log("2");

          setCurrentOffset(-width.current * (+pageParam - 2));
        }
      }
    } else {
      setCurrent(1);
    }
  }, [pages, page, maxOffset]);

  React.useEffect(() => {
    setPages(Math.ceil(totalLength / 10));
    // setPages(4);
  }, [totalLength]);

  const [currentOffset, setCurrentOffset] = React.useState(0);
  React.useEffect(() => {
    setMaxOffset(-((pages - 3) * width.current));

    // setOffset(width.current);
    console.log(maxOffset);
  }, [pages, maxOffset]);

  const setPage = ({ current }: { current: number }): string => {
    const searchParams = new URLSearchParams(page.search);
    if (current) {
      searchParams.set("page", `${current}`);
    }
    return searchParams.toString();
  };

  const dispatch = useAppDispatch();
  const renderPagination = () => {
    const arr: any[] = [];
    for (let i = 1; i < pages + 1; i++) {
      arr.push(
        <NavLink
          onClick={() => {
            setCurrent(i);
            dispatch(setScrollTop(true));
          }}
          to={{ search: setPage({ current: i }) }}
          className={`${styles["pagination__item"]} ${
            i === current
              ? styles["pagination__item--active"]
              : styles["pagination__item--disabled"]
          }`}
          key={i}
        >
          {i}
        </NavLink>
      );
    }
    if (arr.length > 1) {
      return arr;
    }
  };

  React.useEffect(() => {
    console.log(currentOffset);
  }, [currentOffset]);
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <>
      {pages > 1 && (
        <div className={styles["pagination__wrapper"]}>
          <div className={`${styles["pagination__navigation"]}`}>
            <IconPrev
              theme-pagination-chevron={theme}
              onClick={() => {
                setCurrentOffset((prev) => {
                  if (current === pages) return prev;

                  return Math.min(0, (prev += width.current));
                });
                setCurrent((prev) => {
                  if (prev - 1 > 0) return prev - 1;
                  return prev;
                });
                if (current - 1 > 0) {
                  navigate({ search: setPage({ current: current - 1 }) });
                  // dispatch(setScrollTop(true));
                }
              }}
              className={`${styles["pagination__icon--prev"]} ${
                pages > 3 &&
                current > 2 &&
                styles["pagination__icon--prev__expand--1"]
              } 
          ${
            pages > 4 &&
            current > 3 &&
            styles["pagination__icon--prev__expand--2"]
          } 
          ${current === 1 && styles["pagination__icon--prev__end"]}`}
            />
            {pages > 3 && (
              <span
                onClick={() => {
                  navigate({ search: setPage({ current: 1 }) });
                  setCurrent(1);
                  setCurrentOffset(0);
                  // dispatch(setScrollTop(true));
                }}
                theme-pagination-navigation={theme}
                className={`${styles["pagination__navigation--first"]} ${
                  current > 2 &&
                  styles["pagination__navigation--first__visible--1"]
                } ${
                  pages > 4 &&
                  current > 3 &&
                  styles["pagination__navigation--first__visible--2"]
                }`}
              >
                1
              </span>
            )}
            <span
              theme-pagination-navigation={theme}
              className={`${styles["pagination__three-dots--left"]} ${
                pages > 4 &&
                current > 3 &&
                styles["pagination__three-dots--left__visible"]
              }`}
            >
              ...
            </span>
            <div className={styles["pagination__visible-part"]}>
              <div
                style={{ transform: `translateX(${currentOffset}rem)` }}
                theme-pagination={theme}
                className={styles["pagination"]}
              >
                {renderPagination()}
              </div>
            </div>

            <span
              theme-pagination-navigation={theme}
              className={`${styles["pagination__three-dots--right"]} 
          ${
            pages > 4 &&
            !(current > pages - 3) &&
            styles["pagination__three-dots--right__visible"]
          }`}
            >
              ...
            </span>
            {pages > 3 && (
              <span
                onClick={() => {
                  navigate({ search: setPage({ current: pages }) });
                  // dispatch(setScrollTop(true));
                }}
                theme-pagination-navigation={theme}
                className={`${styles["pagination__navigation--last"]} 
          ${
            !(current > pages - 2) &&
            styles["pagination__navigation--last__visible--1"]
          }  ${
                  pages > 4 &&
                  !(current > pages - 3) &&
                  styles["pagination__navigation--last__visible--2"]
                }`}
              >
                {pages}
              </span>
            )}

            <IconNext
              theme-pagination-chevron={theme}
              onClick={() => {
                setCurrentOffset((prev) => {
                  if (width.current && maxOffset) {
                    if (current === 1) return prev;
                    if (prev - width.current < maxOffset) {
                      return prev;
                    }
                    return (prev -= width.current);
                  }
                  return prev;
                });
                setCurrent((prev) => {
                  if (prev + 1 <= pages) return prev + 1;
                  return prev;
                });
                if (current + 1 <= pages) {
                  navigate({ search: setPage({ current: current + 1 }) });
                  // dispatch(setScrollTop(true));
                }
              }}
              className={`${styles["pagination__icon--next"]} ${
                pages > 3 &&
                !(current > pages - 2) &&
                styles["pagination__icon--next__expand--1"]
              } ${
                !(current > pages - 3) &&
                pages > 4 &&
                styles["pagination__icon--next__expand--2"]
              }  ${current === pages && styles["pagination__icon--prev__end"]}`}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;
