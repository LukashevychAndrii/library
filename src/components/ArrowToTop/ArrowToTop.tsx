import React from "react";
import styles from "./ArrowToTop.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setScrollTop } from "../../store/slices/scroll-slice";

const ArrowToTop = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const scroll = useAppSelector((state) => state.scroll.scrolledALittle);
  const dispatch = useAppDispatch();
  return (
    <>
      {scroll && (
        <div
          onClick={() => {
            dispatch(setScrollTop(true));
          }}
          theme-arrow-top={theme}
          className={styles["arrow-top"]}
        >
          <span className={styles["arrow-top__arrow"]}>&uarr;</span>
        </div>
      )}
    </>
  );
};

export default ArrowToTop;
