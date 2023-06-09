import React from "react";
import styles from "./Pagination.module.scss";
import { useAppSelector } from "../../hooks/redux";
import { NavLink, useLocation } from "react-router-dom";

export const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${styles["pagination__item--active"]} ${styles["pagination__item"]}`
    : styles["pagination__item"];

const Pagination: React.FC<{ totalLength: number }> = ({ totalLength }) => {
  const [current, setCurrent] = React.useState<number>();

  const page = useLocation();
  React.useEffect(() => {
    const searchParams = new URLSearchParams(page.search);
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrent(+pageParam);
    } else {
      setCurrent(1);
    }
  }, [page]);
  const [pages, setPages] = React.useState(0);

  React.useEffect(() => {
    setPages(Math.ceil(totalLength / 10));
  }, [totalLength]);

  const setPage = ({ current }: { current: number }): string => {
    const searchParams = new URLSearchParams(page.search);
    if (current) {
      searchParams.set("page", `${current}`);
    }
    return searchParams.toString();
  };
  const renderPagination = () => {
    const arr: any[] = [];
    for (let i = 1; i < pages + 1; i++) {
      arr.push(
        <NavLink
          onClick={() => {
            setCurrent(i);
          }}
          to={{ search: setPage({ current: i }) }}
          className={
            i === current
              ? `${styles["pagination__item--active"]} ${styles["pagination__item"]}`
              : styles["pagination__item"]
          }
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

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div theme-pagination={theme} className={styles["pagination"]}>
      {renderPagination()}
    </div>
  );
};

export default Pagination;
