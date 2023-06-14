import React from "react";
import styles from "./PinnedBook.module.scss";
import { book } from "../../../../store/slices/book-slice";

let FIRST_RENDER = true;

interface props {
  pBook: book;
  index: number;
  shown: number[];

  newB: number;
}

const PinnedBook: React.FC<props> = ({
  pBook,
  shown,
  index,

  newB,
}) => {
  const [image, setImage] = React.useState("");

  React.useEffect(() => {
    import(`../../../Home/${pBook.imageLink}`).then((module) => {
      setImage(module.default);
    });
  }, [pBook]);

  const widthRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    console.log(newB);
  }, [newB]);

  return (
    <>
      <li
        ref={widthRef}
        className={`${styles["pinned-books__item"]} ${
          shown.indexOf(index) === -1 && styles["pinned-books__item__hide"]
        } ${
          FIRST_RENDER &&
          shown.indexOf(index) === -1 && [
            styles["pinned-books__item__hide--hard"],
          ]
        } `}
      >
        <div className={styles["card"]}>
          <div className={styles["card__front"]}>
            <img
              className={styles["card__front__front"]}
              src={image}
              alt="pinned book"
            ></img>

            <div className={styles["card__front__back"]}></div>
          </div>
          <div className={styles["card__back"]}>
            <div className={styles["card__back__headings"]}>
              <h1 className={styles["card__back__title"]}>{pBook.title}</h1>
              <h2 className={styles["card__back__author"]}>{pBook.author}</h2>
            </div>
            <p className={styles["card__back__description"]}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
              illum impedit id modi temporibus reprehenderit. Nisi dolor ullam
            </p>
            <div className={styles["card__back__extra-info"]}>
              <div className={styles["card__back__language"]}>
                Language: {pBook.language}
              </div>
              <div className={styles["card__back__pages"]}>
                Pages: {pBook.pages}
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default PinnedBook;
