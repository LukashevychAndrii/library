import React from "react";
import styles from "./BookDetails.module.scss";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const BookDetails = () => {
  const bookDATA = useAppSelector((state) => state.book.currentBookDetails);
  const [imageSrc, setImageSrc] = React.useState("");

  React.useEffect(() => {
    if (bookDATA) {
      import(`./${bookDATA?.imageLink}`).then((module) => {
        setImageSrc(module.default);
      });
    }
  }, [bookDATA]);

  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      book-details-wrapper-theme={theme}
      className={styles["book-details__wrapper"]}
    >
      <div book-details-theme={theme} className={styles["book-details"]}>
        <div
          className={styles["book-details--img"]}
          style={{
            backgroundImage: `url(${imageSrc})`,
          }}
        ></div>
        <div>
          <h1
            className={`heading-1 heading-1--${theme} ${styles["book-details--title"]}`}
          >
            {bookDATA?.title}
          </h1>
        </div>
        <div>
          <h2
            style={{ whiteSpace: "pre-wrap" }}
            className={`heading-2 heading-2--${theme} ${styles["book-details--author"]}`}
          >
            {bookDATA?.author}
          </h2>
        </div>
        <div>
          <span className={styles["book-details__info"]}>Language:</span>{" "}
          {bookDATA?.language}
        </div>
        <div>
          <span className={styles["book-details__info"]}>Pages: </span>{" "}
          {bookDATA?.pages}
        </div>
        <div>
          <span className={styles["book-details__info"]}>Year: </span>{" "}
          {bookDATA?.year}
        </div>
        <div>
          <span className={styles["book-details__info"]}> Country:</span>{" "}
          {bookDATA?.country}
        </div>
        <p className={styles["book-details--description"]}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
          laborum recusandae ullam hic expedita. Saepe distinctio provident
          ullam quo suscipit adipisci voluptatum quas, mollitia officiis error.
          Molestias magni sunt dolore. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ipsa similique repellat quibusdam cupiditate optio
          et rerum possimus fugiat dolore rem!
        </p>

        <Link
          to="/library"
          className={`btn btn--${theme} ${styles["book-details__btn-back"]}`}
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default BookDetails;
