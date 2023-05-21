import React from "react";
import styles from "./BookItem.module.scss";
import { Link } from "react-router-dom";

import { ReactComponent as Heart } from "../../img/SVG/heart.svg";
import { ReactComponent as HeartOutlined } from "../../img/SVG/heart-outlined.svg";
import { book } from "../../store/slices/book-slice";

interface props {
  book: book;
}
const BookItem: React.FC<props> = ({ book }) => {
  const [imageSrc, setImageSrc] = React.useState("");

  const [liked, setLiked] = React.useState<boolean>(false);
  React.useEffect(() => {
    import(`./${book.imageLink}`).then((module) => {
      setImageSrc(module.default);
    });
    setLiked(book.liked);
  }, [imageSrc, setImageSrc, book.imageLink, setLiked, book.liked]);

  const ref = React.useRef<HTMLInputElement>(null);

  return (
    <li className={styles["book"]}>
      <img className={styles["book__image"]} src={imageSrc} alt="book" />
      <div className={styles["book__description"]}>
        <h1>
          <Link className="heading-1" to={`${book.id}`}>
            {book.title}
          </Link>
        </h1>
        <h2 className="heading-2">{book.author}</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. At molestias
          maiores tempora voluptate.
        </p>
        <Link to={`${book.id}`} className="btn-more--black">
          Details &rarr;
        </Link>
      </div>

      <input
        ref={ref}
        type="checkbox"
        name="heart"
        id={`heart-${book.id}`}
        className={styles["book__checkbox"]}
        checked={liked}
        onChange={() => {
          setLiked(!liked);
        }}
      />
    </li>
  );
};

export default BookItem;
